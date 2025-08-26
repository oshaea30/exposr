    accuracy_by_confidence = merged.groupby('confidence_range')['feedbackType'].apply(
        lambda x: (x == 'accurate').sum() / len(x)
    )
    
    return accuracy_by_confidence
```

## Data Processing Pipeline

### 1. Daily Data Collection
```bash
# Automated daily export (future implementation)
curl -X POST https://exposr.com/api/admin/export \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -o "data/daily/exposr-$(date +%Y-%m-%d).json"
```

### 2. Data Aggregation Script
```javascript
const fs = require('fs');
const path = require('path');

function aggregateWeeklyData(dailyFiles) {
  const aggregated = {
    period: 'weekly',
    startDate: null,
    endDate: null,
    totalAnalyses: 0,
    totalFeedback: 0,
    analyses: [],
    feedback: [],
    summary: {}
  };
  
  dailyFiles.forEach(filename => {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    aggregated.analyses.push(...data.analyses);
    aggregated.feedback.push(...data.feedback);
    aggregated.totalAnalyses += data.analyses.length;
    aggregated.totalFeedback += data.feedback.length;
  });
  
  // Calculate summary statistics
  aggregated.summary = calculateSummaryStats(aggregated);
  
  return aggregated;
}

function calculateSummaryStats(data) {
  const analyses = data.analyses;
  const feedback = data.feedback;
  
  return {
    detectionStats: {
      aiDetected: analyses.filter(a => a.result.isAI).length,
      humanDetected: analyses.filter(a => !a.result.isAI).length,
      avgConfidence: analyses.reduce((sum, a) => sum + a.result.confidence, 0) / analyses.length
    },
    feedbackStats: {
      accurateCount: feedback.filter(f => f.feedbackType === 'accurate').length,
      inaccurateCount: feedback.filter(f => f.feedbackType === 'inaccurate').length,
      feedbackRate: feedback.length / analyses.length
    },
    imageStats: {
      avgFileSize: analyses.reduce((sum, a) => sum + a.imageMetadata.filesize, 0) / analyses.length,
      topFormats: getFormatDistribution(analyses),
      avgDimensions: getAverageDimensions(analyses)
    },
    privacyStats: {
      consentRate: analyses.filter(a => a.consent?.research_training).length / analyses.length,
      deleteRequests: 0 // Track delete code usage
    },
    geographyStats: {
      topCountries: getCountryDistribution(analyses),
      timezoneDistribution: getTimezoneDistribution(analyses)
    }
  };
}
```

### 3. Machine Learning Data Prep
```python
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

def prepare_training_data(json_files):
    """
    Prepare data for ML model training from Exposr JSON exports
    """
    all_data = []
    
    for file in json_files:
        with open(file, 'r') as f:
            data = json.load(f)
            all_data.extend(data['analyses'])
    
    # Filter for consented images only
    consented_data = [
        item for item in all_data 
        if item.get('consent', {}).get('research_training', False)
    ]
    
    # Extract features and labels
    features = []
    labels = []
    
    for item in consented_data:
        # Extract image metadata features
        meta = item['imageMetadata']
        feature_vector = [
            meta['filesize'],
            meta['dimensions']['width'],
            meta['dimensions']['height'],
            meta['dimensions']['width'] * meta['dimensions']['height'],  # total pixels
            meta['filesize'] / (meta['dimensions']['width'] * meta['dimensions']['height']),  # compression ratio
        ]
        
        features.append(feature_vector)
        labels.append(1 if item['result']['isAI'] else 0)
    
    return np.array(features), np.array(labels)

def validate_model_accuracy(json_files):
    """
    Validate current model accuracy using user feedback
    """
    all_analyses = []
    all_feedback = []
    
    for file in json_files:
        with open(file, 'r') as f:
            data = json.load(f)
            all_analyses.extend(data['analyses'])
            all_feedback.extend(data['feedback'])
    
    # Create feedback lookup
    feedback_dict = {f['analysisId']: f for f in all_feedback}
    
    # Calculate accuracy metrics
    correct_predictions = 0
    total_feedback = 0
    
    for analysis in all_analyses:
        analysis_id = analysis['analysisId']
        if analysis_id in feedback_dict:
            feedback = feedback_dict[analysis_id]
            if feedback['feedbackType'] == 'accurate':
                correct_predictions += 1
            total_feedback += 1
    
    accuracy = correct_predictions / total_feedback if total_feedback > 0 else 0
    
    return {
        'overall_accuracy': accuracy,
        'total_feedback': total_feedback,
        'correct_predictions': correct_predictions,
        'confidence_correlation': calculate_confidence_correlation(all_analyses, feedback_dict)
    }
```

## Integration with External Tools

### 1. Google Sheets Integration
```javascript
// Export summary to Google Sheets
function exportToGoogleSheets(jsonData) {
  const summaryData = [
    ['Date', 'Total Analyses', 'AI Detected', 'Avg Confidence', 'Feedback Rate', 'Accuracy Rate'],
    [
      new Date().toISOString().split('T')[0],
      jsonData.metadata.totalAnalyses,
      jsonData.analyses.filter(a => a.result.isAI).length,
      jsonData.analyses.reduce((sum, a) => sum + a.result.confidence, 0) / jsonData.analyses.length,
      jsonData.feedback.length / jsonData.analyses.length,
      jsonData.feedback.filter(f => f.feedbackType === 'accurate').length / jsonData.feedback.length
    ]
  ];
  
  // Use Google Sheets API to append data
  // Implementation depends on your preferred method
}
```

### 2. Business Intelligence Tools
```sql
-- For tools like Metabase, Grafana, etc.
-- Convert JSON to SQL-friendly format

CREATE TABLE analyses_staging (
    analysis_id VARCHAR(32),
    timestamp TIMESTAMP,
    file_format VARCHAR(20),
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    ai_detected BOOLEAN,
    confidence INTEGER,
    country VARCHAR(10),
    region VARCHAR(50),
    feedback_type VARCHAR(20),
    has_comment BOOLEAN
);

-- Load data from JSON exports
INSERT INTO analyses_staging 
SELECT 
    analysis_id,
    timestamp::timestamp,
    image_metadata->>'format',
    (image_metadata->>'filesize')::integer,
    (image_metadata->'dimensions'->>'width')::integer,
    (image_metadata->'dimensions'->>'height')::integer,
    (result->>'isAI')::boolean,
    (result->>'confidence')::integer,
    location->>'country',
    location->>'region',
    feedback.feedback_type,
    feedback.comment IS NOT NULL
FROM json_analyses 
LEFT JOIN json_feedback feedback ON analyses.analysis_id = feedback.analysis_id;
```

## Benefits of JSON Export Approach

### 1. Simplicity
- No database setup required for MVP
- Easy to implement and test
- Portable data format
- Version control friendly

### 2. Flexibility
- Can be analyzed with any tool
- Easy to share with researchers
- Multiple backup copies
- Format-agnostic processing

### 3. Privacy
- No server-side data storage
- User controls their own data
- Easy to audit and verify
- Transparent data practices

### 4. Development Speed
- Faster MVP development
- No database maintenance
- Easy to iterate and change schema
- Simple deployment

## Future Considerations

### When to Move to Database
- More than 1000 analyses per day
- Need real-time analytics
- Complex querying requirements
- Team collaboration needs

### Hybrid Approach
- Keep JSON export for backup
- Use database for real-time features
- Best of both worlds
- Gradual migration path

This JSON-based approach gives you maximum flexibility while keeping the MVP simple and privacy-focused!

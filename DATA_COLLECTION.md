# Exposr Data Collection & Privacy Documentation

## Overview

Exposr collects anonymous usage data to improve AI detection accuracy while respecting user privacy. No user accounts or personal information are required.

## Data Collection Flows

### 1. Image Analysis Flow

```
User uploads image → 
Extract metadata → 
Perform AI analysis → 
Log analysis data → 
Show results + delete code → 
Optional user feedback
```

### 2. Data Types Collected

#### Automatically Collected (Anonymous)
- **Image Metadata**: filename, dimensions, file size, format, last modified date
- **Analysis Results**: AI verdict, confidence score, explanation, timestamp
- **Browser Information**: User-Agent, language, platform, screen resolution, timezone
- **Usage Metadata**: analysis ID, timestamp, delete code
- **Location Data**: Country/region only (anonymized IP geolocation)

#### User-Provided (Optional)
- **Feedback**: Thumbs up/down on result accuracy
- **Comments**: Optional text feedback when result is marked inaccurate
- **Image Consent**: Explicit consent to store image for research/training

#### Never Collected
- Personal identifying information
- Email addresses or account data
- Full IP addresses (only used for geolocation then discarded)
- Exact location (city-level or more precise)

### 3. Data Storage

#### What's Stored by Default
```javascript
{
  analysisId: "abc123def456",
  timestamp: "2025-01-17T10:30:00Z",
  imageMetadata: {
    filename: "photo.jpg",
    dimensions: { width: 1024, height: 768 },
    filesize: 234567,
    format: "image/jpeg"
  },
  analysisResult: {
    verdict: "Likely AI-generated",
    confidence: 87,
    isAI: true
  },
  browserInfo: {
    userAgent: "Mozilla/5.0...",
    language: "en-US",
    timezone: "America/New_York"
  },
  location: {
    country: "US",
    region: "Georgia"
  },
  deleteCode: "xyz789abc123",
  imageStored: false
}
```

#### What's Stored with Consent
```javascript
{
  // ... all above data plus:
  imageStored: true,
  imageData: "[base64_encoded_image_data]",
  consent: {
    research_training: true,
    timestamp: "2025-01-17T10:30:00Z"
  }
}
```

### 4. User Feedback Flow

```
Analysis complete → 
User clicks thumbs up/down → 
Log feedback with analysis ID → 
Optional comment prompt → 
Store feedback data
```

#### Feedback Data Structure
```javascript
{
  analysisId: "abc123def456",
  feedbackType: "accurate" | "inaccurate",
  comment: "Optional user comment",
  timestamp: "2025-01-17T10:35:00Z",
  browserInfo: { /* same as analysis */ }
}
```

### 5. Data Deletion Flow

```
User receives delete code → 
Visits /delete page → 
Enters delete code → 
System removes all associated data → 
Confirmation message
```

## Privacy Safeguards

### 1. Anonymization
- No personal identifiers collected
- IP addresses not stored (only used for country-level geolocation)
- Random analysis IDs instead of sequential numbering
- Browser fingerprinting minimized

### 2. User Control
- **Delete Codes**: Every user gets a unique code to delete their data
- **Explicit Consent**: Image storage only with clear user consent
- **Opt-in Research**: Research participation is optional and clearly marked
- **No Tracking**: No cross-session tracking or cookies for identification

### 3. Data Minimization
- Only collect data necessary for service improvement
- Aggregate statistics preferred over individual data points
- Regular data cleanup of old entries (implement 90-day retention)

### 4. Transparency
- Clear privacy notices on upload page
- FAQ section explains data practices
- Users can see what data is collected before uploading

## Implementation Notes

### Backend API Endpoints (to implement)

```
POST /api/analyze
- Accepts image file + metadata
- Returns analysis results + delete code
- Logs anonymous usage data

POST /api/feedback
- Accepts analysis ID + feedback
- Stores user feedback
- Associates with original analysis

DELETE /api/data/:deleteCode
- Accepts delete code
- Removes all associated data
- Returns confirmation

GET /api/analytics (admin only)
- Returns aggregated usage statistics
- No individual user data
```

### Database Schema

```sql
-- Analysis table
CREATE TABLE analyses (
  id UUID PRIMARY KEY,
  analysis_id VARCHAR(32) UNIQUE,
  delete_code VARCHAR(32) UNIQUE,
  timestamp TIMESTAMP,
  image_metadata JSONB,
  analysis_result JSONB,
  browser_info JSONB,
  location_info JSONB,
  image_data TEXT, -- Only if consent given
  consent JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  analysis_id VARCHAR(32) REFERENCES analyses(analysis_id),
  feedback_type VARCHAR(20),
  comment TEXT,
  timestamp TIMESTAMP,
  browser_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_analyses_delete_code ON analyses(delete_code);
CREATE INDEX idx_analyses_timestamp ON analyses(timestamp);
CREATE INDEX idx_feedback_analysis_id ON feedback(analysis_id);
```

### Security Considerations

1. **Rate Limiting**: Prevent abuse of analysis and feedback endpoints
2. **Input Validation**: Sanitize all user inputs, especially file uploads
3. **Data Encryption**: Encrypt sensitive data at rest and in transit
4. **Access Controls**: Limit admin access to aggregated data only
5. **Audit Logging**: Log all data access and deletion events

### Compliance

#### GDPR Compliance
- ✅ Lawful basis: Legitimate interest for service improvement
- ✅ Data minimization: Only collect necessary data
- ✅ Purpose limitation: Clear purpose statement
- ✅ Right to erasure: Delete codes enable data deletion
- ✅ Transparency: Clear privacy notices

#### CCPA Compliance
- ✅ Right to know: Users understand what data is collected
- ✅ Right to delete: Delete codes enable data removal
- ✅ Right to opt-out: Users can opt out of research consent

## Monitoring & Analytics

### Key Metrics to Track
- Daily/weekly active users
- Analysis accuracy feedback ratios
- Popular image types/formats
- Geographic usage patterns (country-level)
- Performance metrics (analysis speed, error rates)

### Data Retention Policy
- Analysis data: 90 days (configurable)
- Feedback data: 90 days (configurable)
- Consented images: Until explicit deletion or 1 year maximum
- Aggregated statistics: Indefinite (no individual data)

## Future Enhancements

1. **Enhanced Analytics**: More sophisticated feedback analysis
2. **A/B Testing**: Test different UI approaches based on anonymous data
3. **Model Improvement**: Use consented data to train better detection models
4. **Fraud Detection**: Identify and prevent abuse patterns
5. **API Access**: Provide analytics API for researchers (aggregated data only)

## Implementation Checklist

- [x] Frontend data collection components
- [x] Anonymous usage tracking
- [x] User feedback system
- [x] Delete code generation and handling
- [x] Privacy notices and consent forms
- [ ] Backend API implementation
- [ ] Database schema setup
- [ ] Data anonymization pipeline
- [ ] Admin analytics dashboard
- [ ] Data retention automation
- [ ] Security audit and testing

import React, { useState } from "react";
import { Trash2, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui";
import { BUTTON_VARIANTS } from "../constants";
import { deleteUserData } from "../utils";

const DataDeletionPage = () => {
  const [deleteCode, setDeleteCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle, deleting, success, error
  const [message, setMessage] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!deleteCode.trim()) {
      setStatus("error");
      setMessage("Please enter a valid delete code");
      return;
    }

    setStatus("deleting");
    setMessage("");

    try {
      await deleteUserData(deleteCode.trim());
      setStatus("success");
      setMessage("Your data has been successfully deleted.");
      setDeleteCode("");
    } catch (error) {
      setStatus("error");
      setMessage("Delete code not found or data already deleted.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Delete Your Data
            </h1>
            <p className="text-gray-600">
              Enter your delete code to remove all associated data from our
              systems
            </p>
          </div>

          <form onSubmit={handleDelete} className="space-y-6">
            <div>
              <label
                htmlFor="deleteCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Delete Code
              </label>
              <input
                type="text"
                id="deleteCode"
                value={deleteCode}
                onChange={(e) => setDeleteCode(e.target.value)}
                placeholder="Enter your delete code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                disabled={status === "deleting"}
              />
              <p className="text-xs text-gray-500 mt-2">
                This code was provided after your image analysis
              </p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg flex items-center space-x-2 ${
                  status === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {status === "success" ? (
                  <Check className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            <Button
              type="submit"
              variant={BUTTON_VARIANTS.PRIMARY}
              className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500"
              disabled={status === "deleting"}
              loading={status === "deleting"}
            >
              {status === "deleting" ? "Deleting..." : "Delete My Data"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              What gets deleted:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>Image metadata and analysis results</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>Any feedback you provided</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>Stored image data (if you consented)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>Associated browser and usage data</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.history.back()}
              className="text-sm text-blue-600 hover:text-blue-700 underline bg-transparent border-none cursor-pointer"
            >
              ← Back to Exposr
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDeletionPage;

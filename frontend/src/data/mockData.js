const MOCK_ANALYSIS = {
  job_id: "demo-mock-123",
  status: "complete",
  event: {
    name: "Mock Disaster Event",
    location: "Global Demo Center",
    analyzedAt: new Date().toISOString(),
    satelliteSource: "Demo Simulation",
    processingTimeSeconds: 1.5
  },
  stats: {
    buildingsDamaged: 156,
    roadsBlocked: 3,
    floodedAreaKm2: 2.4,
    totalAreaAnalyzedKm2: 12.5,
    confidenceScore: 0.89,
    severeCases: 42,
    moderateCases: 64,
    minorCases: 50
  },
  geojson: {
    type: "FeatureCollection",
    features: []
  },
  locations: [],
  alerts: [
    {
      id: "alert-mock-1",
      type: "structural",
      message: "Demo: Significant structural damage detected.",
      severity: "high",
      timestamp: new Date().toISOString()
    }
  ],
  report: "This is a demonstration report. No real satellite data was used for this summary. The AI assessment indicates expected structural damage consistent with the simulation parameters."
};

export default MOCK_ANALYSIS;

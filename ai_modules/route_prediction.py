# Mock data for Safe Route ML Prediction
import random

def predict_safety_score(start_lat: float, start_lng: float, end_lat: float, end_lng: float) -> dict:
    """
    Mock ML predictive function.
    In reality, this would query a database of historical crime data
    by region and use an ML model to score the path.
    """
    
    # Generate mock paths
    routes = [
        {"route_id": "A", "safety_score": random.randint(70, 99), "risk_factors": ["well_lit"]},
        {"route_id": "B", "safety_score": random.randint(40, 80), "risk_factors": ["isolated_areas"]},
        {"route_id": "C", "safety_score": random.randint(20, 60), "risk_factors": ["high_crime_rate"]}
    ]
    
    # Sort by safest
    safest_routes = sorted(routes, key=lambda x: x['safety_score'], reverse=True)
    
    return {
        "status": "success",
        "best_route": safest_routes[0]['route_id'],
        "all_routes": safest_routes
    }

if __name__ == "__main__":
    # Test script locally
    print(predict_safety_score(40.7128, -74.0060, 40.7306, -73.9866))

from sklearn.linear_model import LinearRegression
import numpy as np

def predict_next_score(score_list):
    # If less than 2 scores, prediction not reliable
    if len(score_list) < 2:
        return "Not enough data for prediction"

    # X = test numbers (0,1,2,...)
    X = np.array(range(len(score_list))).reshape(-1, 1)
    y = np.array(score_list)

    model = LinearRegression()
    model.fit(X, y)

    # Predict next test
    next_test = np.array([[len(score_list)]])
    prediction = model.predict(next_test)

    return round(float(prediction[0]), 2)


import numpy as np
import pandas as pd
from collections import Counter

class KNN:
    def __init__(self, k=3):
        self.k = k

    def fit(self, X_train, y_train):
        self.X_train = X_train
        self.y_train = y_train

    def predict(self, X_test):
        predictions = [self._predict(x) for x in X_test]
        return np.array(predictions)

    def _predict(self, x):
        # Compute the distances between x and all examples in the training set
        distances = [np.linalg.norm(x - x_train) for x_train in self.X_train]
        # Sort by distance and return indices of the first k neighbors
        k_indices = np.argsort(distances)[:self.k]
        # Extract the labels of the k nearest neighbor training samples
        k_nearest_labels = [self.y_train[i] for i in k_indices]
        # Return the most common class label
        most_common = Counter(k_nearest_labels).most_common(1)
        return most_common[0][0]

def load_data(file_path):
    # Load the CSV file
    data = pd.read_csv(file_path)
    # Assuming the last column is the label
    X = data.iloc[:, :-1].values
    y = data.iloc[:, -1].values
    return X, y

def main():
    # Paths to the CSV files
    train_file_path = 'csv_KNN_Liver_CSU_1.csv'  # Update this with your train file path
    test_file_path = 'csv_KNN_Liver_CSU_new.csv'    # Update this with your test file path

    # Load the data from the CSV files
    X_train, y_train = load_data(train_file_path)
    X_test, y_test = load_data(test_file_path)

    # Create and train the KNN model
    knn = KNN(k=3)
    knn.fit(X_train, y_train)

    # Make predictions
    predictions = knn.predict(X_test)

    # Print the predictions
    print("Predictions:", predictions)
    print("Actual labels:", y_test)

if __name__ == "__main__":
    main()

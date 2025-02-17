# %% author Martin
import pandas as pd

from datetime import datetime
import calendar
import time

import joblib  # or import pickle

import itertools


# %%
def getCurrentTimestamp():
    return int(calendar.timegm(time.gmtime()))


#for ex: 06/12/2021  06:55:00
def convert_date_2_timestamp(time_str):
    #print(time_str)
    try:
        dt = datetime.strptime(time_str, "%d/%m/%Y %H:%M")
        return dt.timestamp()
    except ValueError:
        print("Invalid time format. Please use 'dd/mm/yyyy HH:MM:SS'")
    return None

#time_str = "18/2/2024 06:55"
#timestamp = convert_date_2_timestamp(time_str)
#print(f"Timestamp for {time_str}: {timestamp}") 

# %%
def shortest_path_starting_from_first(points, distances):
    """
    Finds the shortest path that visits all points exactly once, 
    starting from the first point in the list.

    Args:
        points: A list of point labels (e.g., ['A', 'B', 'C', 'D', 'E']).
        distances: A dictionary where keys are tuples of two points (in any order)
                   and values are the distances between them.

    Returns:
        A tuple containing:
            - The shortest path (a list of point labels in order).
            - The total distance of the shortest path.
    """

    if not points:
        return [], 0  # Handle empty points list

    start_point = points[0]
    remaining_points = points[1:]

    min_distance = float('inf')
    shortest_path_found = None

    for path_permutation in itertools.permutations(remaining_points):
        current_path = [start_point] + list(path_permutation) # Prepend the starting point
        total_distance = 0
        for i in range(len(current_path) - 1):
            current_point = current_path[i]
            next_point = current_path[i + 1]
            distance = distances.get((current_point, next_point)) or distances.get((next_point, current_point))
            if distance is None:
                raise ValueError(f"Distance between {current_point} and {next_point} not defined.")
            total_distance += distance

        if total_distance < min_distance:
            min_distance = total_distance
            shortest_path_found = current_path

    return shortest_path_found, min_distance


# %%
def get_n_predict(data_from_js):
    loaded_model = joblib.load('random_forest_model_1.joblib')  # or pickle.load(open('random_forest_model.pkl', 'rb'))
    
    points = [0, 2, 3, 5, 7]
    from_time = 1638781000

    #break down into pairs of turbines
    pairs = list(itertools.combinations(points, 2))  # 2 specifies pairs
    print(pairs)
    pair_len = len(pairs)
    distances = {}   #key: pair, value: predicted fuel
    for i in range(0, pair_len):
        predicted_value = loaded_model.predict(pd.DataFrame({
                    'from_turbine': [pairs[i][0]], 
                    'to_turbine': [pairs[i][1]], 
                    'from_wave_h': [1.304],
                    'from_e_wind': [0.95]	, 
                    'from_n_wind': [8.94], 
                    'from_e_current': [-0.065], 
                    'from_n_current': [-0.305], 
                    'from_time': [1638781000]
                }))
        distances[pairs[i]] = predicted_value[0]
    #
    #print(distances)
    #
    shortest_path_result, min_distance_result = shortest_path_starting_from_first(points, distances)
    print("Shortest Path:", shortest_path_result)
    print("Total Fuel:", min_distance_result)

    return shortest_path_result, min_distance_result

# %%
#get_n_predict()

# %%




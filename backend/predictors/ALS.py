from typing import List, Tuple
import implicit
import numpy as np


class ALSModel:
    def __init__(self):
        self.model = implicit.als.AlternatingLeastSquares(
            factors=25, regularization=0.1, iterations=20
        )
        self.load_weights()

    def load_weights(self) -> None:
        self.model.item_factors = np.load("weights/item_factors_1.npy")
        self.model.item_norms.data = np.load("weights/item_norms_1.npy")

    def predict(self, row_id: int, k: int) -> List[Tuple[int]]:
        output = self.model.similar_items(row_id, k)
        return output

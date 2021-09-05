from .ALS import ALSModel
from .NCF import NCFModel


class MergedModel:
    def __init__(self, als_quality_threshold=0.9975):
        self.als_model = ALSModel()
        self.ncf_model = NCFModel()
        self.als_quality_threshold = als_quality_threshold

    def predict(self, i, k=20):
        als_predictions = self.als_model.predict(i, k)
        if any(
            [
                recommendation[1] < self.als_quality_threshold
                for recommendation in als_predictions
            ]
        ):
            ncf_predictions = self.ncf_model.predict(i, k)
            return ncf_predictions
        else:
            return als_predictions

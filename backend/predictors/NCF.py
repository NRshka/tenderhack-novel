from typing import List, Tuple
import numpy as np
import faiss


class NCFModel:
    def __init__(self):
        self.load_weights()
        self.key_index = faiss.IndexFlatIP(self.key_embeddings.shape[1])
        self.key_index.add(self.key_embeddings)

    def load_weights(self):
        self.query_embeddings = np.load("weights/mlp_searcher_queries.npy")
        self.key_embeddings = np.load("weights/mlp_searcher_keys.npy")

    def predict(self, i, k=20) -> List[Tuple[int, float]]:
        d, i_out = self.key_index.search(self.query_embeddings[i:i + 1], k)
        return list(zip(i_out.flatten(), d.flatten()))

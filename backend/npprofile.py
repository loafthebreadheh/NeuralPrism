from npscanner import FeatureBias
from safetensors.torch import save_file, safe_open

class NPProfile:
    """
    A savable and loadable list of feature biases.
    """
    def __init__(self, biases:list[FeatureBias]):
        self.biases = biases
    
    def save(self, path:str):
        """
        Saves this profile to the given path via safetensors.
        """
        tensors = {}
        metadata = {}
        for i, b in enumerate(self.biases):
            tensors[str(i)] = b.vector
            metadata[f"{i}_name"] = b.name
            metadata[f"{i}_bias"] = str(b.bias)
            metadata[f"{i}_layer"] = str(b.layer)
        save_file(tensors, path, metadata)
        
    @classmethod
    def load(cls, path:str):
        """
        Loads a profile from the given path via safetensors.
        """
        with safe_open(path, framework="pt") as f:
            metadata:dict[str, str] = f.metadata()
            tensors = {k: f.get_tensor(k) for k in f.keys()}
        biases = []
        for i in range(len(tensors.keys())):
            bias = FeatureBias(tensors[str(i)], float(metadata[f"{i}_bias"]), int(metadata[f"{i}_layer"]), metadata[f"{i}_name"])
            biases.append(bias)
        return cls(biases)
        
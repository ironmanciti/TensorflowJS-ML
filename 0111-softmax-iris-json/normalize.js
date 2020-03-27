function MinMaxScaling(tensor, prevMin = null, prevMax = null) {
    const min = prevMin || tensor.min();
    const max = prevMax || tensor.max();
    const normedTensor = tensor.sub(min).div(max.sub(min));
    return {
        tensor: normedTensor,
        min,
        max
    }
}
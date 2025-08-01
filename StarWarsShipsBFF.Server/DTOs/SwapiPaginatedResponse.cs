using System.Text.Json.Serialization;

namespace StarWarsShipsBFF.Server.DTOs;

public class SwapiPaginatedResponse<T> // T represents the different types of result e.g. starship
{
    [JsonPropertyName("results")]
    public List<SwapiResult<T>> Results { get; set; } = [];

    [JsonPropertyName("next")]
    public string? Next { get; set; }
}
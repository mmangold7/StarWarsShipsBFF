using System.Text.Json.Serialization;

namespace StarWarsShipsBFF.Server.DTOs;

public class Starship
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;

    [JsonPropertyName("starship_class")]
    public string StarshipClass { get; set; } = string.Empty;

    [JsonPropertyName("manufacturer")]
    public string Manufacturer { get; set; } = string.Empty;

    [JsonPropertyName("cost_in_credits")]
    public string CostInCredits { get; set; } = string.Empty;

    [JsonPropertyName("length")]
    public string Length { get; set; } = string.Empty;

    [JsonPropertyName("crew")]
    public string Crew { get; set; } = string.Empty;

    [JsonPropertyName("passengers")]
    public string Passengers { get; set; } = string.Empty;

    [JsonPropertyName("max_atmosphering_speed")]
    public string MaxAtmospheringSpeed { get; set; } = string.Empty;

    [JsonPropertyName("hyperdrive_rating")]
    public string HyperdriveRating { get; set; } = string.Empty;

    [JsonPropertyName("MGLT")]
    public string MGLT { get; set; } = string.Empty;

    [JsonPropertyName("cargo_capacity")]
    public string CargoCapacity { get; set; } = string.Empty;

    [JsonPropertyName("consumables")]
    public string Consumables { get; set; } = string.Empty;

    [JsonPropertyName("films")]
    public List<string> Films { get; set; } = [];

    [JsonPropertyName("pilots")]
    public List<string> Pilots { get; set; } = [];

    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;

    [JsonPropertyName("created")]
    public DateTime Created { get; set; }

    [JsonPropertyName("edited")]
    public DateTime Edited { get; set; }
}
namespace StarWarsShipsBFF.Server.DTOs;

public class SwapiResult<T>
{
    public T Properties { get; set; } = default!;
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using StarWarsShipsBFF.Server.DTOs;

namespace StarWarsShipsBFF.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class StarshipsController(
    StarWarsApiService swapiService,
    ILogger<StarshipsController> logger,
    IMemoryCache cache) : ControllerBase
{
    private readonly ILogger<StarshipsController> _logger = logger;

    [HttpGet(Name = "GetAllStarships")]
    public async Task<IEnumerable<Starship>?> Get()
    {
        // this data doesn't change frequently, so this saves hitting the api over and over
        if (cache.TryGetValue("allStarships", out IEnumerable<Starship>? allStarships))
            return allStarships;

        var ships = await swapiService.GetAllStarshipsAsync();
        var shipsEnumerated = ships.ToList();

        cache.Set("allStarships", shipsEnumerated, TimeSpan.FromMinutes(60)); 

        return shipsEnumerated;
    }
}
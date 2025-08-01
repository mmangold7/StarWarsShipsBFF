using Microsoft.AspNetCore.Mvc;
using StarWarsShipsBFF.Server.DTOs;

namespace StarWarsShipsBFF.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class StarshipsController(StarWarsApiService swapiService, ILogger<StarshipsController> logger) : ControllerBase
{
    private readonly ILogger<StarshipsController> _logger = logger;

    [HttpGet(Name = "GetAllStarships")]
    public async Task<IEnumerable<Starship>?> Get()
    {
        var allStarships = await swapiService.GetAllStarshipsAsync();

        return allStarships?.ToArray();
    }
}
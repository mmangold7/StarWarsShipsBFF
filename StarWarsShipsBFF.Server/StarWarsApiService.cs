using StarWarsShipsBFF.Server.DTOs;

namespace StarWarsShipsBFF.Server;

public class StarWarsApiService // typed httpclient to be registered in program.cs
{
    private readonly HttpClient _httpClient;

    private const string StarshipsFirstPagePathAndQuery = "starships/?expanded=true"; // subsequent pages are supplied in response via "next" attribute

    public StarWarsApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://www.swapi.tech/api/");
    }

    public async Task<IEnumerable<Starship>?> GetAllStarshipsAsync()
    {
        var allStarships = new List<Starship>();
        var nextStarshipsPagePathAndQuery = StarshipsFirstPagePathAndQuery;

        while (nextStarshipsPagePathAndQuery is not null)
        {
            var swapiResponse = 
                await _httpClient.GetFromJsonAsync<SwapiPaginatedResponse<Starship>>(nextStarshipsPagePathAndQuery);

            if (swapiResponse?.Results is null) break;
                
            allStarships.AddRange(swapiResponse.Results.Select(result => result.Properties));

            nextStarshipsPagePathAndQuery = swapiResponse.Next is null 
                ? null 
                : new Uri(swapiResponse.Next).PathAndQuery; // use URI to easily grab just the path and query for the next page to update variable
        }

        return allStarships;
    }
}
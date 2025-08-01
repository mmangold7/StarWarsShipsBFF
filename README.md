# StarWarsShipsBFF

## High-level Overview

This repository contains a visual studio solution originally created as a new React and ASP.NET Core project that uses Typescript. The goal is to create a simple Backend For Frontend with a React frontend that allows filtering the starships data from SWAPI on manufacturer.

## Approach

### Backend (.NET Core)
1. Removed sample code related to WeatherForecast
2. Registered a typed HttpClient that:
   * Retrieves all starships from the Star Wars API at swapi.tech
   * Handles pagination logic by following each "next" URI property until they run out
   * Generisizes the type of result from the SWAPI, though only Starship is used currently (potential YAGNI)
3. Added a MemoryCache to:
   * Reduce calls to SWAPI by simply returning cached data (data changes slowly, using 1 hour for cache)
   * Improve response time of the BFF
4. Injected the typed client and memory cache into a new StarWarsController with JSON Starships endpoint

### Frontend (React + TS)
1. Replaced sample weather table with starships table and adjusted api call to new endpoint
2. Added a select to filter by manufacturer
3. Data inconsistencies were handled:
   * Manufacturers are comma separated but some also contain a comma in their name
   * At least one type Cyngus -> Cygnus
   * At least one use of a forward slash instead of comma as delimiter
   * Standardized 'Inc', 'Inc.', 'Incorporated'
   * Still have an open bug with Nubia Star Drives duplicated with their Incorporated version
  
### Authentication
1. Implemented simple cookie-based auth with HttpOnly and SameSite=Lax for basic security against CSRF and XSS
2. Single hard-coded credential in appsettings.json, plaintext for demo, injected into AuthController
3. React frontend features Login component that switches to starships list upon successful auth

## Areas for Improvement
1. Definitely move the standardization logic from frontend to backend, so it's done once, where it makes sense, and cached
2. Add unit tests for each of the data inconsistencies with the manufacturers
3. Add at least one unit test for the pagination logic to ensure it stops when next is null or empty
4. Fix outstanding bug with Nubia Star Drives data cleansing (unit test and fix standardization logic after moving to backend)
5. Perhaps a logout button
6. UI could be improved visually
7. This auth is only good for a demo, need password hashing for real applications

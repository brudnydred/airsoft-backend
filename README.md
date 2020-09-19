## POMOC: 

API działa pod adresem `http://asg-paintball-api.herokuapp.com`

### USERS

Route `/users`

| ENDPOINT | METODA | PARAMS | BODY | TOKEN |
|---|---|---|---|---|
| `/` | GET | brak | brak | tak |
| `/:id` | GET | `id: string` | brak | tak |
| `/signup` | POST | brak | `username: string`, `password: string`, `email: string` | nie |
| `/signin` | POST | brak | `username: string`, `password: string` | nie |
| `/:id/signout` | PUT | `id: string` | brak | tak |
| `/:id` | DELETE | `id: string` | brak | tak |
| `/:id` | PUT | `id: string` | `username: string`, `password: string`, `email: string` | tak |
| `/:id/friend` | PUT | `id: string` | `friendId: string` *lub* `friendUsername: string` | tak |
| `/:id/friend` | DELETE | `id: string` | `friendId: string` | tak |

### GAMES

Route `/games`

| ENDPOINT | METODA | PARAMS | BODY | TOKEN |
|---|---|---|---|---|
| `/` | POST | brak | `userId: string`, `gamePassword: string`, `location: string` | tak |
| `/join` | POST | brak | `userId: string`, `gameCode: string`, `gamePassword: string` | tak |
| `/team` | PUT | brak | `userId: string`, `team: string`, `gameId: string` | tak |
| `/start` | PUT | brak | `gameId: string` | tak |
| `/end` | PUT | brak | `gameId: string`, `gameTime: number`, `teamRedScores: number`, `teamBlueScores: number` | tak |
| `/update` | PUT | brak | `gameId: string`, `gameTime: number`, `teamRedScores: number`, `teamBlueScores: number` | tak |
  
## UWAGI

Dla lepszego działania API zaleca się przechowywanie niewrażliwych danych w pamięci cache urządzenia lub przeglądarki.

## STACK TECHNOLOGICZNY:
- Node.js + Express.js
- MongoDB
- mongoose
- cors
- dotenv
- git bash
- npm
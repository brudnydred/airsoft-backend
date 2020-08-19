### ZAŁOŻENIA:

Serwer ma na celu utrzymywać połączenie aplikacji mobilnej jak i internetowej z bazą danych i wyświetlnie aktualnych danych na obu aplikacjach.

Obługiwać ma operacje CRUD użytkownika oraz rozgrywek.

Serwer ma hashować wrażliwe dane przy transferze danych między bazą danych a klientem.
  
### TO DO:
- [x] postawienie serwera
- [x] nawiązanie połączenia z MongoDB
- [ ] szyfrowanie wrażliwych danych
- [x] schemat użytkownika
- [x] schemat rozgrywki 
- [x] routing użytkowników (/users)
  - [x] / -> GET (READ)
  - [x] /add -> POST (CREATE)
  - [x] /delete/:id -> DELETE (DELETE)
  - [x] /update/:id - PUT (UPDATE)
  - [ ] /login -> GET
    - [ ] stwórz sesję połączenia dla użytkownika
  - [ ] /logout/:id -> PUT (UPDATE) 
    - [x] zaktualizuj w kolekcji 'users' pole 'lastActiveAt'
    - [ ] zamknij sesje połączenia
  - [x] /add_friend/:id -> PUT (UPDATE: dodaj użytkownika do znajomych)
  - [x] /remove_friend/:id -> PUT (UPDATE: usun użytkownika ze znajomych)
- [x] routing rozgrywek (/games)
  - [x] / -> GET (READ)
  - [x] /add -> POST (CREATE)
  - [x] /delete/:id -> DELETE (DELETE)
  - [x] /update/:id - PUT (UPDATE)
  
### POMOC: 

  API działa pod adresem `http://asg-paintball-api.herokuapp.com`

  **Pobieranie informacji o wszystkich użytkownikach** 
  
  `Metoda GET`
  ```
  http://asg-paintball-api.herokuapp.com/users
  ```

  **Pobieranie informacji o konkretnym użytkowniku**

  `Metoda GET`
  ```
  http://asg-paintball-api.herokuapp.com/users/:id
  ```
  Wymagane w żądaniu jest przekazanie `id` użytkownika.
  
  **Tworzenie nowego konta użytkownika**

  `Metoda POST`
  ```
  http://asg-paintball-api.herokuapp.com/signup
  ```
  Wymagane w żądaniu jest przekazanie `username`, `password`, `email`.

  **Usuwanie konta użytkownika**

  `Metoda DELETE`
  ```
  http://asg-paintball-api.herokuapp.com/users/:id
  ```
  Wymagane w żądaniu jest przekazanie `id` użytkownika.

  **Edycja danych użytkownika**

  `Metoda PUT`
  ```
  http://asg-paintball-api.herokuapp.com/users/:id
  ```
  Wymagane w żądaniu jest przekazanie `id` użytkownika.

  Wymagane w żądaniu jest przekazanie `username`, `password`, `email`.

  **Dodawanie znajomego**

  `Metoda PUT`
  ```
  http://asg-paintball-api.herokuapp.com/users/:id/friend/
  ```
  Wymagane w żądaniu jest przekazanie `id`.

  Wymagane w żądaniu jest przekazanie `friendId` LUB `friendUsername`.

  **Usuwanie znajomego**

  `Metoda DELETE`
  ```
  http://asg-paintball-api.herokuapp.com/users/:id/friend/
  ```
  Wymagane w żądaniu jest przekazanie `id`.

  Wymagane w żądaniu jest przekazanie `friendId`.

  **Wylogowanie _(zmiana czasu ostatniej aktywności)_**

  `Metoda PUT`
  ```
  http://asg-paintball-api.herokuapp.com/users/:id/logout
  ```
  
  Wymagane w żądaniu jest przekazanie `id` użytkownika.

### UWAGI
Dla lepszego działania API zaleca się przechowywanie niewrażliwych danych w pamięci cache urządzenia lub przeglądarki.

`id` przekazywane jest jako właściwość `params` żądania (parametr adresu URL), pozostałe dane przekazywane są jako właściwości `body` (ciało żądania)

- żądanie - request
- odpowiedź - response

### STACK TECHNOLOGICZNY:
- Node.js + Express.js
- MongoDB
- mongoose
- cors
- dotenv
- git bash
- npm
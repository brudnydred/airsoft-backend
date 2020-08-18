ZAŁOŻENIA:
  Serwer ma na celu utrzymywać połączenie aplikacji mobilnej jak i internetowej z bazą danych i wyświetlnie aktualnych danych na obu aplikacjach.

  Obługiwać ma operacje CRUD użytkownika oraz rozgrywek.

  Serwer ma hashować wrażliwe dane przy transferze danych między bazą danych a klientem.
  
TO DO:
- [x] postawienie serwera
- [x] nawiązanie połączenia z MongoDB
- [ ] sesja użytkownika
  - [ ] token sesji
- [ ] szyfrowanie wrażliwych danych
- [ ] schemat użytkownika
- [ ] schemat rozgrywki 
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
  
POMOC: 
  API działa pod adresem http://asg-paintball-api.herokuapp.com.

  Przykładowe pobranie danych o użytkownikach:
  ```
  http://asg-paintball-api.herokuapp.com/users
  ```

STACK TECHNOLOGICZNY:
- Node.js + Express.js
- MongoDB
- mongoose
- cors
- dotenv
- git bash
- npm
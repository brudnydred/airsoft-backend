ZAŁOŻENIA:
  Serwer ma na celu utrzymywać połączenie aplikacji mobilnej jak i internetowej z bazą danych i wyświetlnie aktualnych danych na obu aplikacjach.
  Obługiwać ma operacje CRUD użytkownika oraz rozgrywek.
  Serwer ma hashować wrażliwe dane przy transferze danych między bazą danych a klientem.
  
TO DO:
- [x] postawienie serwera
- [x] nawiązanie połączenia z MongoDB
- [ ] sesja użytkownika
  - [ ] token sesji
  - [ ] zamknięcie sesji po wylogowaniu użytwkonika 
- [ ] szyfrowanie wrażliwych danych
- [ ] schemat użytkownika
- [ ] schemat rozgrywki 
- [x] routing użytkowników
  - [x] /users/add -> POST (CREATE)
  - [x] /users -> GET (READ)
  - [x] /users/update/:id - PUT (UPDATE)
  - [x] /users/delete/:id -> DELETE (DELETE)
- [x] routing rozgrywek
  - [x] /games/add -> POST (CREATE)
  - [x] /games -> GET (READ)
  - [x] /games/update/:id - PUT (UPDATE)
  - [x] /games/delete/:id -> DELETE (DELETE)
- [ ] dodanie operacji na bazie danych do routing
  - [ ] użytkownicy 
    - [ ] tworzenie 
    - [ ] pobieranie danych
    - [ ] edycja
    - [ ] usuwania
  - [ ] rozgrywki 
    - [ ] tworzenie 
    - [ ] pobieranie danych
    - [ ] edycja
    - [ ] usuwania

STACK TECHNOLOGICZNY:
- Node.js + Express.js
- MongoDB
- mongoose
- cors
- dotenv
- git bash
- npm
-- Seed users table
INSERT INTO users (username, password, role)
VALUES 
('Sathvik', '"$2a$10$lzNBRmvF2KNepj5ero5FC.N0SWaZkV15q1oN59jORr5.rHMCP761O"', 'ADMIN'),
('Cherry', '"$2a$10$feYzGPpj3/qs5bQforGx8.4lj1I4XWYypWYXUcZrv5IKqLn0wnA.e"', 'ADMIN'),
('Rajesh', '"$2a$10$feYzGPpj3/qs5bQforGx8.4lj1I4XWYypWYXUcZrv5IKqLn0wnA.e"', 'ADMIN'),
('Manendra', '""$2a$10$6Kj6Ho387qDRvJzMplva9.KoJBh60EJxIdy52SQVNu2MarvdPFLqy""', 'ADMIN'),
('Venky', '""$2a$10$RmjPamwaIPKndTAJtSHEjObL0K4XIipBLpjPVlWUgPLra/iP5LrCi""', 'ADMIN')
ON CONFLICT DO NOTHING;


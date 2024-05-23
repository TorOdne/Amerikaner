Du må fylle ut alle feltene under som står "your_ _here", 
på bruker navn må du ha ett unikt bruker navn, passordet kan være det samme på alle brukern men må ikke,
på spot så må du velge mellom 1-4.

Vi har gjort det sånn at det går bare ann å registrere 4 brukere om gangen som gjør at det er bare -
4 spillere som kan spille om gangen:

curl -X POST http://localhost:80/register -d "{\"username\":\"your_username_here\",\"password\":\"your_password_here\",\"spot\":your_spot_here}" -H "Content-Type: application/json"
eksempel: curl -X POST http://localhost:80/register -d "{\"username\":\"per\",\"password\":\"123\",\"spot\":1}" -H "Content-Type: application/json"

Før du kan starte spillet må du ha registrert spillere:
curl -X POST http://localhost:80/start

Viss du har lyst å sjekke hvilken type kort hver av spillerne har skriver du inn, bakom deck/ skriver du -
inn spilleren sitt navn. Som eksemple nedenfor:
curl -X GET http://localhost:80/deck/1

Så for å starte bud runden skriver man inn:
curl -X POST http://localhost:80/startbidding

Her er ett eksempel på måten ett av budene kan se ut, du kan endre på tallet 1 og 4 som du ser neden for,
i eksemplet. Det første tallet ska være spilleren sitt navn og der 4 er, er budet man vill gi.
curl -X POST http://localhost:80/bid/1/4

Viss man ikke har lyst å by mer skriver man bare pass bakom spilleren sin spot som det her:
curl -X POST http://localhost:80/bid/1/pass

Etter at alle har gitt et bud og en av dem blir vinneren av bud runden skriver man bare inn commanden -
neden for, for å kunne starte selveste spillet:
curl -X POST http://localhost:80/startplaying

Når man skal spille en hånd så må man først sjekke hvilken kort spilleren har, da gjør man deck/spilleren sin spot.
Etter å ha funnet ut hvilken kort man har bytter man bare ut der man ser 
spades og 5 men korte og sorten man vil spiller:

Viktig å huske spilleren som vant bud runden, velger hva tromfen skal være med å legge ut sitt første kort,
sorten på kortet han legger ut kommer til å være tromfen for spillet.
curl -X POST http://localhost:80/play/1/spades/5

Viss du vil starte spillet på nytt må du bare lukke serveren og begynne fra begynnelsen.

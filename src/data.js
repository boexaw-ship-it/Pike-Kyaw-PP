import tournament from "../data/tournament.json";
import rawTeams from "../data/teams.json";
import groupResults from "../data/group-results.json";
import knockoutResults from "../data/knockout-results.json";

const teams = rawTeams.map((t) => ({
  ...t,
  players: t.players.map((name, i) => ({ name, photo: t.photos?.[i] || "" })),
}));

export default { tournament, teams, results: [...groupResults, ...knockoutResults] };

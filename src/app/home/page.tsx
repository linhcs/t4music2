import ListenerHome from "@/components/ui/home";

export default function HomePage() {
  const username = "User"; // this should come from user session later on 

  return (
    <div>
      <ListenerHome username={username} />
    </div>
  );
}

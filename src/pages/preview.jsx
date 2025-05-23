import   {useState}   from "react";
import RegisterCow from "../components/RegisterCow";
import CowList from "../components/CowList";
 
function Preview() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🐄 Inventario Bovino en Blockchain</h1>
      <RegisterCow onRegister={() => setRefresh(!refresh)} />
      <hr />
      <CowList key={refresh} />
    </div>
  );
}

export default Preview;

import "./styles.css";
import Calendar from "./Calendar";

export default function App() {
  // Example events — replace with your backend data later
  const events = [
    {
      id: 1,
      title: "Tech Meeting",
      date: "2025-11-10",
      time: "2:00 PM",
      category: "Meeting",
      communityGroup: "Technology",
      link: "https://acrm.org/acrm-communities/brain-injury/",
    },
    {
      id: 2,
      title: "BI-ISIG Webinar",
      date: "2025-11-12",
      time: "11:00 AM",
      category: "Webinar",
      communityGroup: "BI-ISIG",
      link: "https://acrm.org/acrm-communities/brain-injury/",
    },
    {
      id: 3,
      title: "BI-ISIG All Member Meeting",
      date: "2025-11-12",
      time: "09:00 AM",
      category: "Webinar",
      communityGroup: "BI-ISIG",
      link: "https://acrm.org/acrm-communities/brain-injury/",
    },
    {
      id: 4,
      title: "Stroke ISIG All Member Meeting",
      date: "2025-11-12",
      time: "4:30 PM",
      category: "Social",
      communityGroup: "Stroke ISIG",
      link: "https://acrm.org/acrm-communities/brain-injury/",
    },
    {
      id: 5,
      title: "BI-ISIG All Member Meeting",
      date: "2025-10-12",
      time: "09:00 AM",
      category: "Webinar",
      communityGroup: "BI-ISIG",
      link: "https://acrm.org/acrm-communities/brain-injury/",
    },
  ];

  return (
    <div className="App">
      <Calendar events={events} />
    </div>
  );
}

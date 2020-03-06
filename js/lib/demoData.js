import * as firebase from "firebase";
import moment from "moment";

class DemoData {
  static async setupDemoData() {
    console.log("setting up demo data - oakforest_international_edu");
    //setup and re-initialize sample data each time the domain is loaded

    // clear old data

    // db.collection("oakforest_international_edu")
    //   .doc("calendar")
    //   .delete();

    // build new data

    var cal = [];

    cal[0] = {
      color: "red",
      date_start: moment()
        .add(1, "days")
        .format("YYYY-MM-DD"),
      description: "Sports Day",
      dtstamp: "2020222222211111",
      icon: "ios-basketball",
      location: "Sports Field",
      summary: "Sports Day",
      description:
        "School Sports Days are a great way to celebrate the end of term/year or just have a fun day out of the classroom. Qualified and experienced coaches will lead students through a variety of sports that they would not normally have access to. \n\nSports include:\n- Gymnastics\n- Futsal\n- Volleyball\n- Floorball\n- Hockey\n- European Handball\n- Cricket\n- Basketball\n- Table Tennis\n",
      demo: true,
      photo1:
        "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2F202002%2F86cc1d9d-13e6-4b32-8f97-31dba4ed569f?alt=media&token=06f19ce9-8b41-49e8-8628-992fdfbfe1bd"
    };

    cal[1] = {
      color: "blue",
      date_start: moment().format("YYYY-MM-DD"),
      date_time_start: moment().format("YYYYMMDD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-cafe",
      summary: "Parent Coffee Morning",
      location: "Cafeteria",
      time_end_pretty: "10:30 pm",
      time_start_pretty: "9:30 pm",
      demo: true,
      description:
        "All parents are welcome to come for a morning coffee and breakfast in the school hall. There is always a short presentation (20 minutes). These include ways to really help support your child's learning at school, parenting advice and support and information about a wide range of things from safety to spellings and maths to mindfulness and more!\n\nWhy come in for a coffee morning? \n\n- meet other parents\n- chat to your friends\n- have breakfast (for free!)\n- learn something new\n- feel involved and up to date\n- feel great\n\nMums, Dads, Grandparents, Carers, Aunties, Uncles and friends of the family are ALL welcome"
    };

    cal[2] = {
      color: "blue",
      date_start: moment().format("YYYY-MM-DD"),
      date_time_start: moment().format("YYYYMMDD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-musical-notes",
      summary: "Suzuki Showcase Concert",
      location: "Music Room",
      demo: true,
      description:
        "The cornerstone of the Suzuki Strings program is the creation of a cooperative relationship between teacher, parent, and student.\n\nParents take an active role in the educational process by attending all lessons and classes, and by practicing daily with their children at home."
    };

    cal[3] = {
      color: "blue",
      date_start: moment(new Date())
        .add(1, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-play",
      summary: "High School Career Exploration",
      location: "Library",
      demo: true,
      description:
        "The Career Exploration Day started in 2008 with 57 exhibitors and more than 750 students from six area school districts. Now, this annual event showcases more than 200 regional high-demand careers with hands-on demonstrations, simulators, and breakout sessions. \n\nStudents interact with different companies to learn about local careers, their work environment, necessary skill sets, earning potential and the training needed to become employed.\n\nSearch for the top occupations in our region, or learn more about available career options to better understand employment options.\n\necessary\n\nCareer Exploration Day fact sheet:\nhttps://wordpressstorageaccount.blob.core.windows.net/wp-media/wp-content/uploads/sites/679/2018/08/CEDBrochure.pdf"
    };

    cal[4] = {
      color: "blue",
      date_start: moment(new Date())
        .add(2, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-bookmark",
      summary: "PYP Exhibition Opening Night",
      location: "Theater",
      time_end_pretty: "7:30 pm",
      time_start_pretty: "6:00 pm",
      demo: true,
      description: ""
    };

    cal[5] = {
      color: "blue",
      date_start: moment(new Date())
        .add(3, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-play",
      summary: "Grade 4 Swimming Carnival",
      location: "Pool",
      time_end_pretty: "5:00 pm",
      time_start_pretty: "3:30 pm",
      demo: true,
      description:
        "General Swimming Carnival Information\n\nThe program has been formatted to ensure all students, irrespective of swimming ability, have many chances to represent their House and contribute points to their team on the day. \n\nEvent categories are as follows:\n- Competitive events - 50m in each stroke for all age groups\n- Non-Competitive events - 25m in each stroke\n- Novelty events – Race with floatation aid.\n\nStudents can enter a mix of 25m and 50m events across all strokes (only 1 distance per stroke). \n\nMaximum participation is encouraged!"
    };

    cal[6] = {
      color: "purple",
      date_start: moment(new Date())
        .add(4, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-play",
      summary: "Grade 12 Senior Exams",
      location: "Senior Study Hall",
      demo: true,
      description: ""
    };

    cal[7] = {
      color: "purple",
      date_start: moment(new Date())
        .add(5, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-play",
      summary: "Grade 12 Senior Exams",
      location: "Senior Study Hall",
      demo: true,
      description: ""
    };

    cal[8] = {
      color: "purple",
      date_start: moment(new Date())
        .add(6, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-play",
      summary: "Grade 12 Senior Exams",
      location: "Senior Study Hall",
      demo: true,
      description: ""
    };

    cal[9] = {
      color: "blue",
      date_start: moment(new Date())
        .add(6, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-medical",
      summary: "First Aid and CPR",
      location: "Indoor Basketball Court Number 2",
      time_end_pretty: "3:00 pm",
      time_start_pretty: "2:00 pm",
      demo: true,
      description: ""
    };

    cal[10] = {
      color: "blue",
      date_start: moment(new Date())
        .add(6, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-play",
      summary: "Grade 4 Field Studies",
      location: "The Zoo",
      demo: true,
      description: ""
    };

    cal[10] = {
      color: "blue",
      date_start: moment(new Date())
        .add(6, "days")
        .format("YYYY-MM-DD"),
      description: "",
      dtstamp: "2020222222211111",
      icon: "ios-play",
      summary: "CANCELLED Dragons Badminton International",
      location: "Hall 2, 100 Long Street, Longville",
      demo: true,
      description: ""
    };

    for (var i = 0; i < cal.length; i++) {
      console.log(cal[i]);
      firebase
        .firestore()
        .collection("oakforest_international_edu")
        .doc("calendar")
        .collection("calendarItems")
        .doc("demo data " + i)
        .set(cal[i]);
    }
  }
}

export default DemoData;

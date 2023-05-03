async function process_argv() {
  let { argv } = process;
  argv = argv.slice(2);
  const result = await studentActivitiesRegistration(argv);

  return result;
}

async function getStudentActivities() {
  const response = await fetch("http://localhost:3001/activities");
  const result = response.json();
  return result;
}

// getStudentActivities().then((result) => {
//   console.log(result);
// });

async function studentActivitiesRegistration(data) {
  if (data[0] === "CREATE") {
    await addStudent(data[1], data[2]);
  } else {
    await deleteStudent(data[1]);
  }
  console.log(data[1]);
}

async function addStudent(name, day) {
  const studentData = await fetch("http://localhost:3001/students");
  const studentDataResult = await studentData.json();
  let latestId = studentDataResult[studentDataResult.length - 1].id;

  let studentActivity = [];

  return getStudentActivities().then((activities) => {
    activities.forEach((activity) => {
      const activityDays = activity.days;
      activityDays.forEach((activityDay) => {
        if (activityDay === day) {
          studentActivity.push(activity);
        }
      });
    });

    let activityArray = [];
    studentActivity.forEach((activity) => {
      let activityObject = {
        name: activity.name,
        desc: activity.desc,
      };
      activityArray.push(activityObject);
    });
    const result = {
      id: latestId + 1,
      name: name,
      activities: activityArray,
    };

    return fetch("http://localhost:3001/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });
  });
}

async function deleteStudent(id) {
  let message = {
    message: `Successfully deleted student data with id ${id}`,
  };
  return await fetch(`http://localhost:3001/students/${id}`, {
    method: "DELETE",
  }).then(() => console.log(message));
}

// deleteStudent(3);

process_argv()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  studentActivitiesRegistration,
  getStudentActivities,
  addStudent,
  deleteStudent,
};

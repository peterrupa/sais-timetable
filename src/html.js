const download = `
  <a download="schedule.png" class="SSSBUTTON_ACTIONLINK" id="download-btn">
    Download Schedule
  </a>
`;

const canvas = `
  <canvas id="timetable" class="shown" />
`;

const toggle =
  '<a href="#" class="timetable-button SSSBUTTON_ACTIONLINK">Toggle Timetable</a>';

const wrapper = `
  <table id="timetable-wrapper" style="width: 100%;">
    <tr>
      <td class="padding"></td>
      <td>${download}</td>
      <td>${toggle}</td>
      <td class="canvas-container">${canvas}</td>
    </tr>
  </table>
`;

export default wrapper;

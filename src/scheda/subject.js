import { DAYS } from './constants';

class Subject {
  constructor(day, time, courseCode, section, room, color) {
    this.day = day;
    this.time = time;
    this.courseCode = courseCode;
    this.section = section;
    this.room = room;
    this.color = color;

    this.id = this._getUUID();

    this.render = this.render.bind(this);
    this._drawCourse = this._drawCourse.bind(this);
    this._drawTop = this._drawTop.bind(this);
    this._drawBottom = this._drawBottom.bind(this);
    this._convertTime = this._convertTime.bind(this);
    this._timeIsPM = this._timeIsPM.bind(this);
    this._textAlignCenter = this._textAlignCenter.bind(this);
  }

  render(ctx, theme, cell) {
    const time = this.time.replace(/:/g, '').split('-');
    const [start, end] = time.map((t, i) => this._convertTime(t, i));

    const dayIndex = DAYS.findIndex(day => day.toUpperCase().startsWith(this.day.toUpperCase()));
    this._drawCourse(ctx, { start, end }, dayIndex, theme.timeColumnWidth, cell, theme.sched);
  }

  _drawCourse(ctx, time, day, padLeft, cell, theme) {
    const { start, end } = time;
    const difference = end - start;

    const x = (day * cell.width) + padLeft;
    const y = (start / 4) * cell.height + cell.height;
    const verticalAlign = (difference / 4) * cell.height;

    ctx.beginPath();
    this._drawTop(x, start, cell, ctx);
    this._drawBottom(x, end, cell, ctx);

    ctx.strokeStyle = ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 0.5;

    ctx.fillStyle = theme.color;
    ctx.font = `${theme.style} ${theme.size}px ${theme.font}`;

    // Course Text
    const label = `${this.courseCode} ${this.section ? `\n${this.section}` : ''}`
    ctx.fillText(
      label,
      this._textAlignCenter(cell.width, ctx, label) + x,
      y + (verticalAlign / 2) - 2
    );

    if (this.room) ctx.fillText(
      this.room,
      this._textAlignCenter(cell.width, ctx, this.room) + x,
      y + (verticalAlign / 2) + 10
    );
    ctx.stroke();

    return this.id;
  }

  _drawTop(x, time, cell, ctx) {
    const y = Math.floor(time / 4) * cell.height + cell.height;

    switch (time % 4) {
      case 0:
        ctx.lineTo(x, y);
        ctx.lineTo(x + cell.width, y);
        break;
      case 1:
        ctx.lineTo(x, y);
        ctx.lineTo(x + cell.width / 2, y + cell.height / 2);
        ctx.lineTo(x + cell.width, y);
        break;
      case 2:
        ctx.lineTo(x, y);
        ctx.lineTo(x + cell.width, y + cell.height);
        break;
      case 3:
        ctx.lineTo(x, y + cell.height);
        ctx.lineTo(x + cell.width / 2, y + cell.height / 2);
        ctx.lineTo(x + cell.width, y + cell.height);
        break;
    }
  }

  _drawBottom(x, time, cell, ctx) {
    const y = Math.floor(time / 4) * cell.height + cell.height;

    switch (time % 4) {
      case 0:
        ctx.lineTo(x + cell.width, y);
        ctx.lineTo(x, y);
        break;
      case 1:
        ctx.lineTo(x + cell.width, y);
        ctx.lineTo(x + cell.width / 2, y + cell.height / 2);
        ctx.lineTo(x, y);
        break;
      case 2:
        ctx.lineTo(x + cell.width, y + cell.height);
        ctx.lineTo(x, y);
        break;
      case 3:
        ctx.lineTo(x + cell.width, y + cell.height);
        ctx.lineTo(x + cell.width / 2, y + cell.height / 2);
        ctx.lineTo(x, y + cell.height);
        break;
    }
  }

  _convertTime(string, isEnd) {
    string = string.padEnd(3, '0');

    let time = +string;
    if (this._timeIsPM(time, isEnd)) time += 1200;

    string = time.toString();
    return (
      ((+string.substring(0, string.length - 2) - 7) * 4)
      +
      (+string.substring(string.length - 2) / 15)
    );
  }

  _timeIsPM(time, isEnd) { return time < 700 || (isEnd && time === 700); }

  _textAlignCenter(width, ctx, text) { return (width - ctx.measureText(text).width) / 2; }

  _getUUID() {
    const s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
  }
}

export default Subject;

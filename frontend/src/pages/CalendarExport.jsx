import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { writeFile, utils } from 'xlsx';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import autoTable from 'jspdf-autotable';
import { fetchCases, fetchColumns, exportSelectedColumns } from '../services/caseService';
import { useNavigate } from 'react-router-dom'; // import for navigation

export default function CalendarExport() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [columnsMeta, setColumnsMeta] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCols, setSelectedCols] = useState([]);
  const [range, setRange] = useState({ start: null, end: null });
  const navigate = useNavigate(); // hook for navigation

  // fetch events for calendar view
  const fetchEvents = async (start, end) => {
    try {
      const data = await fetchCases(start.toISOString(), end.toISOString());
      const events = data.map(item => ({
        title: item.title,
        start: item.created_at,
      }));
      setEvents(events);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleDatesSet = ({ start, end }) => {
    fetchEvents(start, end);
  };

  // open export dialog
  const handleExportClick = async () => {
    try {
      const cols = await fetchColumns();
      setColumnsMeta(cols);

      if (calendarRef.current) {
        const view = calendarRef.current.getApi().view;
        setRange({ start: view.currentStart, end: view.currentEnd });
      } else {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setRange({ start, end });
      }

      setDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch columns:', error);
      setDialogOpen(true);
    }
  };

  const handleToggleCol = (key) => {
    setSelectedCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setRange(prev => ({ ...prev, [name]: date }));
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return date;
      return format(dateObj, 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.warn('Date formatting error:', error);
      return date;
    }
  };

  const exportData = async (type) => {
    try {
      const payloadCols = selectedCols;
      if (!range.start || !range.end) {
        alert('Please select valid date range');
        return;
      }
      const startDate = new Date(range.start);
      const endDate = new Date(range.end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Invalid date format');
        return;
      }
      if (startDate >= endDate) {
        alert('Start date must be before end date');
        return;
      }
      if (payloadCols.length === 0) {
        alert('Please select at least one column');
        return;
      }
      const data = await exportSelectedColumns(payloadCols, startDate.toISOString(), endDate.toISOString());
      if (!data || data.length === 0) {
        alert('No data found for the selected criteria');
        return;
      }

      const formatted = data.map(row => {
        const obj = {};
        Object.keys(row).forEach(key => {
          if (key === 'created_at' && row[key]) {
            obj[key] = isNaN(new Date(row[key]).getTime()) ? row[key] : formatDate(row[key]);
          } else {
            obj[key] = row[key] || '';
          }
        });
        return obj;
      });

      if (type === 'excel') {
        const ws = utils.json_to_sheet(formatted);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Export');
        writeFile(wb, 'export.xlsx');
      } else {
        const doc = new jsPDF();
        const tableCols = payloadCols.map(key => key.charAt(0).toUpperCase() + key.slice(1));
        const tableRows = formatted.map(row => payloadCols.map(key => row[key]));

        doc.text('Exported Data', 14, 20);
        autoTable(doc, { head: [tableCols], body: tableRows, startY: 30, styles: { fontSize: 8 }, headStyles: { fillColor: [41, 128, 185] } });
        doc.save('export.pdf');
      }

      setDialogOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      return format(dateObj, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Button variant="contained" onClick={() => navigate('/Home')}>Home</Button> {/* Home button added */}
        <Button variant="contained" onClick={handleExportClick}>Export</Button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        initialView="dayGridMonth"
        selectable={true}
        events={events}
        datesSet={handleDatesSet}
        ref={calendarRef}
        height="auto"
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Columns & Date Range</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            {columnsMeta.length > 0 ? (
              columnsMeta.map(col => (
                <FormControlLabel
                  key={col.key}
                  control={<Checkbox checked={selectedCols.includes(col.key)} onChange={() => handleToggleCol(col.key)} />}
                  label={col.label}
                />
              ))
            ) : (
              <p>Loading columns...</p>
            )}
          </div>

          {range.start && range.end && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <TextField label="Start" type="datetime-local" name="start" value={formatDateForInput(range.start)} onChange={handleRangeChange} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="End"   type="datetime-local" name="end"   value={formatDateForInput(range.end)}   onChange={handleRangeChange}   InputLabelProps={{ shrink: true }}   fullWidth />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => exportData('excel')} disabled={selectedCols.length === 0}>Export Excel</Button>
          <Button onClick={() => exportData('pdf')}   disabled={selectedCols.length === 0}>Export PDF</Button>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
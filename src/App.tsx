import './App.scss'
import { useEffect, useState } from "react";
import { IIncident } from "./Interfaces.ts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@fremtind/jkl-table-react";
import { ErrorTag, Tag, WarningTag } from "@fremtind/jkl-tag-react";

const App = () => {
    const [incidents, setIncidents] = useState<IIncident[]>([]);

    useEffect(() => {
        fetch('../data/data.txt')
            .then((res) => res.text())
            .then((text) => {
                const incidentsArr:IIncident[] = [];
                const lines = text.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    line = line.replace(/  +/g, '###');
                    const columns = line.split('###');
                    incidentsArr.push({
                        dateTime: columns[0],
                        depth: Number(columns[3]),
                        magnitude: Number(columns[5]),
                        location: columns[7]
                    });
                }
                setIncidents(incidentsArr);
            });
    }, []);

  const prettifyDateString = (dateString: string) => {
      let fixedFormat = dateString.replace(' ', 'T');
      fixedFormat = fixedFormat.replace(/\./g, '-');
      const date = new Date(fixedFormat);
      return date.toLocaleString('en-GB', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'CET',
      });
  };

  const renderMagnitude = (magnitude: number) => {
      const mag = magnitude.toFixed(1);
      if (magnitude < 5.4) { // minor
        return <Tag className='app__magnitude-tag'>{mag}</Tag>
      } else if (magnitude >= 5.4 && magnitude < 6.4) {
          return <WarningTag className='app__magnitude-tag'>{mag}</WarningTag>
      } else {
          return <ErrorTag className='app__magnitude-tag'>{mag}</ErrorTag>
      }
  };

  return (
    <Table className='app'>
        <TableHead>
            <TableRow>
                <TableHeader key={0}>Date</TableHeader>
                <TableHeader key={1}>Magnitude</TableHeader>
                <TableHeader key={2}>Depth</TableHeader>
                <TableHeader key={3}>Location</TableHeader>
            </TableRow>
        </TableHead>
        <TableBody>
            {incidents.map((incident, idx) => {
                return (
                    <TableRow key={idx}>
                        <TableCell>{prettifyDateString(incident.dateTime)}</TableCell>
                        <TableCell>{renderMagnitude(incident.magnitude)}</TableCell>
                        <TableCell>{incident.depth}</TableCell>
                        <TableCell>{incident.location}</TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    </Table>
  );
}

export default App

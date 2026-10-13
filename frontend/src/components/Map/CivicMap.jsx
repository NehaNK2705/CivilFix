import React, { useEffect, useRef, useState } from 'react';
import { useReports } from '../../context/ReportsContext';
import { PriorityBadge } from '../Common/PriorityBadge';
import { StatusPill } from '../Common/StatusPill';
import { CATEGORY_LABELS, formatRelativeTime } from '../../utils/formatters';
import { MapPin, Layers, AlertTriangle, Info, Sparkles } from 'lucide-react';
import L from 'leaflet';

export function CivicMap() {
  const { reports, setSelectedReport } = useReports();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [activePriority, setActivePriority] = useState('all');

  const filtered = reports.filter((r) => {
    if (activeCategory !== 'all' && r.category !== activeCategory) return false;
    if (activePriority !== 'all' && r.priorityLabel !== activePriority) return false;
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around San Francisco Bay Area / Metro
      const map = L.map(mapContainerRef.current, {
        center: [37.7749, -122.4194],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when reports or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = [];

    filtered.forEach((report) => {
      const lat = report.coordinates?.lat || 37.7749;
      const lng = report.coordinates?.lng || -122.4194;
      bounds.push([lat, lng]);

      // Determine marker color
      let markerColor = '#14b8a6'; // Teal
      if (report.priorityLabel === 'Critical') markerColor = '#e11d48'; // Rose
      else if (report.priorityLabel === 'High') markerColor = '#ea580c'; // Orange
      else if (report.priorityLabel === 'Medium') markerColor = '#d97706'; // Amber

      const customIcon = L.divIcon({
        className: 'custom-civic-pin',
        html: `
          <div style="background-color: ${markerColor}; width: 26px; height: 26px; border-radius: 9999px; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">
            ${report.priorityScore}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup
      const popupContent = `
        <div style="font-family: inherit; max-width: 200px; padding: 2px;">
          <div style="font-size: 11px; font-weight: bold; color: ${markerColor}; text-transform: uppercase;">
            ${report.id} • ${report.priorityLabel} (${report.priorityScore})
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px; line-height: 1.2;">
            ${report.title}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
            ${report.location}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedReport(report);
      });

      markersRef.current.push(marker);
    });

    if (bounds.length > 0 && map) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch {
        // ignore bounds fitting if points coincide
      }
    }
  }, [filtered, setSelectedReport]);

  return (
    <div className="space-y-4">
      {/* Map Header & Filter Chips */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-teal-600" />
            Civic Issue Spatial Heatmap & Pin Map
          </h2>
          <p className="text-xs text-slate-500">
            Interactive map displaying {filtered.length} geocoded complaints across municipal sectors
          </p>
        </div>

        {/* Priority Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Critical', 'High', 'Medium', 'Low'].map((prio) => (
            <button
              key={prio}
              onClick={() => setActivePriority(prio)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                activePriority === prio
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {prio === 'all' ? 'All Priority' : prio}
            </button>
          ))}
        </div>
      </div>

      {/* Map + List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leaflet Map (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs h-[520px] relative">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md z-10 text-[11px] font-semibold text-slate-700 flex items-center space-x-3">
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 mr-1.5"></span>
              <span>Critical</span>
            </div>
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1.5"></span>
              <span>High</span>
            </div>
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 mr-1.5"></span>
              <span>Low</span>
            </div>
          </div>
        </div>

        {/* Side List Cards (1 col) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs h-[520px] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Location Hotspots ({filtered.length})
            </h3>
            <span className="text-[11px] text-teal-600 font-medium">Click to inspect</span>
          </div>

          {filtered.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="p-3 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-slate-50/80 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono text-[11px] font-bold text-teal-600">
                  {report.id}
                </span>
                <PriorityBadge
                  label={report.priorityLabel}
                  score={report.priorityScore}
                />
              </div>
              <h5 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                {report.title}
              </h5>
              <div className="flex items-center text-[11px] text-slate-500 mt-1 truncate">
                <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                <span className="truncate">{report.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

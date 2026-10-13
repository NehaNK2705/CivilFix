/**
 * CivicFix AI - Realistic Seed Data
 * 14 seeded civic issues covering diverse categories, priority levels, and statuses.
 * Includes realistic city coordinates (Bay Metro area) for map visualization.
 */

export const INITIAL_REPORTS = [
  {
    id: "CF-2026-1001",
    title: "Live electrical wire dangling from fallen streetlight",
    description: "During yesterday's storm the lamp post snapped. An exposed live wire is dangling 4 feet above the sidewalk near the kindergarten entrance, producing visible sparks in wet weather.",
    category: "damaged_streetlight",
    location: "Oakridge Blvd & 12th Ave (Near St. Jude Kindergarten)",
    coordinates: { lat: 37.7795, lng: -122.4180 },
    reporterName: "Elena Rostova",
    priorityScore: 98,
    priorityLabel: "Critical",
    classificationReasons: [
      "Base score for damaged streetlight: 55 pts",
      "Critical electrical safety hazard (shock/electrocution risk) [+38 pts]",
      "Vulnerable population zone (school/hospital vicinity) [+22 pts]"
    ],
    status: "In Progress",
    createdAt: "2026-10-11T08:15:00.000Z",
    updatedAt: "2026-10-12T14:30:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-11T08:15:00.000Z",
        note: "Initial report submitted by resident via CivicFix AI mobile portal.",
        updatedBy: "Elena Rostova (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-11T08:45:00.000Z",
        note: "Escalated to Municipal Power & Lighting Emergency Response crew.",
        updatedBy: "Dispatcher Martinez"
      },
      {
        status: "In Progress",
        timestamp: "2026-10-12T14:30:00.000Z",
        note: "Crew deployed. Power isolated at local junction; replacement pole ordered.",
        updatedBy: "Crew Lead Hayes"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1002",
    title: "Open manhole cover on busy intersection",
    description: "Heavy iron manhole cover dislodged and missing on the southbound lane right after the intersection. Multiple cars swerving abruptly, severe accident risk.",
    category: "drainage",
    location: "Grand Avenue & 5th Crossing, Downtown",
    coordinates: { lat: 37.7833, lng: -122.4167 },
    reporterName: "Marcus Vance",
    priorityScore: 94,
    priorityLabel: "Critical",
    classificationReasons: [
      "Base score for drainage: 68 pts",
      "Severe pedestrian/vehicle fall hazard (open manhole/sinkhole) [+36 pts]",
      "High-speed traffic artery or collision-prone zone [+20 pts]"
    ],
    status: "Acknowledged",
    createdAt: "2026-10-12T09:20:00.000Z",
    updatedAt: "2026-10-12T09:40:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-12T09:20:00.000Z",
        note: "Reported with urgent hazard alert.",
        updatedBy: "Marcus Vance (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-12T09:40:00.000Z",
        note: "Traffic safety team notified. Emergency barricades dispatched.",
        updatedBy: "City Transit Ops"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1003",
    title: "Drinking water main pipe burst flooding roadway",
    description: "High-pressure clean water main burst under pavement. Gushing water is undermining road foundation and creating localized flooding across 2 blocks.",
    category: "water_leakage",
    location: "Pinecrest Road & 8th Street, West District",
    coordinates: { lat: 37.7712, lng: -122.4285 },
    reporterName: "Samantha Reed",
    priorityScore: 88,
    priorityLabel: "Critical",
    classificationReasons: [
      "Base score for water leakage: 64 pts",
      "Active urban flooding / waterlogging hazard [+22 pts]",
      "Rapid progression / escalation indicator [+14 pts]"
    ],
    status: "In Progress",
    createdAt: "2026-10-11T16:05:00.000Z",
    updatedAt: "2026-10-12T07:15:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-11T16:05:00.000Z",
        note: "Citizen reported massive water stream emerging from asphalt crack.",
        updatedBy: "Samantha Reed (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-11T16:30:00.000Z",
        note: "Municipal Water Board valve control notified.",
        updatedBy: "Water Dept Admin"
      },
      {
        status: "In Progress",
        timestamp: "2026-10-12T07:15:00.000Z",
        note: "Main shutoff valve throttled. Excavation team on site.",
        updatedBy: "Engineer Wallace"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1004",
    title: "Deep pothole damaging car suspensions near highway exit",
    description: "Pothole approx 10 inches deep on the off-ramp connecting to State Highway 101. At least three motorists have suffered blown tires in the last 48 hours.",
    category: "pothole",
    location: "Highway 101 Southbound Ramp at Harbor Blvd",
    coordinates: { lat: 37.7650, lng: -122.4050 },
    reporterName: "David K. Chen",
    priorityScore: 78,
    priorityLabel: "High",
    classificationReasons: [
      "Base score for pothole: 52 pts",
      "High-speed traffic artery or collision-prone zone [+20 pts]",
      "Rapid progression / escalation indicator [+14 pts]"
    ],
    status: "Submitted",
    createdAt: "2026-10-13T06:10:00.000Z",
    updatedAt: "2026-10-13T06:10:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-13T06:10:00.000Z",
        note: "Report submitted with damage notes.",
        updatedBy: "David K. Chen (Citizen)"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1005",
    title: "Garbage overflow with foul smell and stray animals",
    description: "Community waste dumpster has not been cleared for 6 days. Trash has spilled over 20 feet onto the sidewalk, creating foul smell and mosquito breeding concern.",
    category: "garbage",
    location: "Greenwood Lane, Sector 4 Community Center",
    coordinates: { lat: 37.7850, lng: -122.4350 },
    reporterName: "Priya Nair",
    priorityScore: 72,
    priorityLabel: "High",
    classificationReasons: [
      "Base score for garbage: 46 pts",
      "Public health and disease vector risk detected [+18 pts]",
      "Rapid progression / escalation indicator [+14 pts]"
    ],
    status: "In Progress",
    createdAt: "2026-10-10T11:45:00.000Z",
    updatedAt: "2026-10-12T10:00:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-10T11:45:00.000Z",
        note: "Sanitation complaint submitted.",
        updatedBy: "Priya Nair (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-11T09:00:00.000Z",
        note: "Waste collection route supervisor assigned.",
        updatedBy: "Sanitation Ops"
      },
      {
        status: "In Progress",
        timestamp: "2026-10-12T10:00:00.000Z",
        note: "Heavy compactor truck dispatched for special clearance.",
        updatedBy: "Supervisor Thorne"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1006",
    title: "Four consecutive streetlights out in pedestrian parkway",
    description: "Total darkness along the pedestrian walkway connecting the residential quarter to the metro station. Unsafe at night for commuters and students.",
    category: "damaged_streetlight",
    location: "Crestview Parkway, between Metro Gate 2 and Elm St",
    coordinates: { lat: 37.7590, lng: -122.4210 },
    reporterName: "Arthur Pendelton",
    priorityScore: 73,
    priorityLabel: "High",
    classificationReasons: [
      "Base score for damaged streetlight: 55 pts",
      "Nighttime public safety & security risk [+18 pts]"
    ],
    status: "Acknowledged",
    createdAt: "2026-10-12T20:15:00.000Z",
    updatedAt: "2026-10-13T08:00:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-12T20:15:00.000Z",
        note: "Nighttime safety report filed.",
        updatedBy: "Arthur Pendelton (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-13T08:00:00.000Z",
        note: "Scheduled for night maintenance inspection.",
        updatedBy: "Lighting Dept"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1007",
    title: "Clogged stormwater drain causing knee-deep waterlogging",
    description: "Plastic debris and tree limbs have blocked the stormwater grate. Even moderate drizzle causes waterlogging that overflows into residential parking garages.",
    category: "drainage",
    location: "Meadowbrook Plaza, North Wing Alley",
    coordinates: { lat: 37.7890, lng: -122.4080 },
    reporterName: "Farhan Qureshi",
    priorityScore: 82,
    priorityLabel: "High",
    classificationReasons: [
      "Base score for drainage: 68 pts",
      "Active urban flooding / waterlogging hazard [+22 pts]"
    ],
    status: "Resolved",
    createdAt: "2026-10-08T13:20:00.000Z",
    updatedAt: "2026-10-11T17:40:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-08T13:20:00.000Z",
        note: "Reported prior to expected weekend rainfall.",
        updatedBy: "Farhan Qureshi (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-09T08:30:00.000Z",
        note: "Assigned to Municipal Stormwater Maintenance.",
        updatedBy: "Public Works Admin"
      },
      {
        status: "In Progress",
        timestamp: "2026-10-10T11:00:00.000Z",
        note: "Suction tanker and jetting team on site.",
        updatedBy: "Drainage Crew #3"
      },
      {
        status: "Resolved",
        timestamp: "2026-10-11T17:40:00.000Z",
        note: "Grate cleared, culvert desilted. Flow restored to 100% capacity.",
        updatedBy: "Inspector Gomez"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1008",
    title: "Collapsed asphalt edge on bridge approach",
    description: "The outer asphalt edge of the bridge approach has fractured away, leaving jagged exposed rubble and narrowing the usable lane.",
    category: "road_damage",
    location: "Riverside Bridge Approach Road, Eastbound",
    coordinates: { lat: 37.7730, lng: -122.3960 },
    reporterName: "Clara Oswald",
    priorityScore: 78,
    priorityLabel: "High",
    classificationReasons: [
      "Base score for road damage: 58 pts",
      "High-speed traffic artery or collision-prone zone [+20 pts]"
    ],
    status: "In Progress",
    createdAt: "2026-10-09T15:10:00.000Z",
    updatedAt: "2026-10-11T11:00:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-09T15:10:00.000Z",
        note: "Structural concern reported by regular cyclist.",
        updatedBy: "Clara Oswald (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-10T09:15:00.000Z",
        note: "Road & Bridge engineering division dispatched.",
        updatedBy: "Infrastructure Admin"
      },
      {
        status: "In Progress",
        timestamp: "2026-10-11T11:00:00.000Z",
        note: "Edge repaved with cold mix; awaiting permanent structural curb replacement.",
        updatedBy: "Foreman Jackson"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1578991624414-276ef23a534f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1009",
    title: "Cracked sidewalk curb obstructing wheelchair ramp",
    description: "A section of sidewalk curb has shifted upwards by 4 inches due to tree roots, preventing wheelchair users and strollers from accessing the pedestrian ramp.",
    category: "road_damage",
    location: "420 Maple Avenue (Corner of Maple & Library Way)",
    coordinates: { lat: 37.7680, lng: -122.4410 },
    reporterName: "Leon Kennedy",
    priorityScore: 60,
    priorityLabel: "Medium",
    classificationReasons: [
      "Base score for road damage: 58 pts",
      "Pedestrian and accessibility restriction [+12 pts]",
      "Mitigating context (minor/cosmetic or low-traffic area) [-14 pts]"
    ],
    status: "Submitted",
    createdAt: "2026-10-12T11:15:00.000Z",
    updatedAt: "2026-10-12T11:15:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-12T11:15:00.000Z",
        note: "Report filed highlighting accessibility needs.",
        updatedBy: "Leon Kennedy (Citizen)"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1010",
    title: "Leaking municipal fire hydrant dripping steadily",
    description: "Fire hydrant at corner has a slow drip from the secondary nozzle. No pressure drop observed, but creates a wet patch on the sidewalk curb.",
    category: "water_leakage",
    location: "Chestnut Street & 14th Ave",
    coordinates: { lat: 37.7770, lng: -122.4320 },
    reporterName: "Beatrice Wong",
    priorityScore: 50,
    priorityLabel: "Medium",
    classificationReasons: [
      "Base score for water leakage: 64 pts",
      "Mitigating context (minor/cosmetic or low-traffic area) [-14 pts]"
    ],
    status: "Resolved",
    createdAt: "2026-10-07T14:00:00.000Z",
    updatedAt: "2026-10-09T16:20:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-07T14:00:00.000Z",
        note: "Minor leak noted.",
        updatedBy: "Beatrice Wong (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-08T10:00:00.000Z",
        note: "Assigned to non-emergency plumbing crew.",
        updatedBy: "Fire Dept Liaison"
      },
      {
        status: "Resolved",
        timestamp: "2026-10-09T16:20:00.000Z",
        note: "Replaced rubber gasket on side port. Hydrant test passed.",
        updatedBy: "Utility Tech Davis"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1011",
    title: "Faded pedestrian crosswalk markings outside elementary school",
    description: "The zebra striping paint has completely worn away after winter road sanding. Vehicles are failing to yield to crossing children in the morning.",
    category: "road_damage",
    location: "Highland Elementary, 720 Highland Ave",
    coordinates: { lat: 37.7610, lng: -122.4490 },
    reporterName: "Nora Chen",
    priorityScore: 80,
    priorityLabel: "High",
    classificationReasons: [
      "Base score for road damage: 58 pts",
      "Vulnerable population zone (school/hospital vicinity) [+22 pts]"
    ],
    status: "In Progress",
    createdAt: "2026-10-10T08:30:00.000Z",
    updatedAt: "2026-10-13T09:10:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-10T08:30:00.000Z",
        note: "School safety committee complaint.",
        updatedBy: "Nora Chen (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-10T12:00:00.000Z",
        note: "Traffic engineering prioritized school zone work order.",
        updatedBy: "Safety Board"
      },
      {
        status: "In Progress",
        timestamp: "2026-10-13T09:10:00.000Z",
        note: "High-visibility thermo-plastic repainting crew scheduled for evening off-peak hours.",
        updatedBy: "Traffic Crew Alpha"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1012",
    title: "Overflowing recycling bins in neighborhood park",
    description: "Recycling bins for plastics and paper are full. Some cardboard boxes have blown onto the grass. Minor issue but needs routine weekend pickup.",
    category: "garbage",
    location: "Sunset Recreation Park, Picnic Area #2",
    coordinates: { lat: 37.7550, lng: -122.4390 },
    reporterName: "Julian Ortiz",
    priorityScore: 32,
    priorityLabel: "Low",
    classificationReasons: [
      "Base score for garbage: 46 pts",
      "Mitigating context (minor/cosmetic or low-traffic area) [-14 pts]"
    ],
    status: "Resolved",
    createdAt: "2026-10-06T17:00:00.000Z",
    updatedAt: "2026-10-07T11:00:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-06T17:00:00.000Z",
        note: "Reported after weekend picnic rush.",
        updatedBy: "Julian Ortiz (Citizen)"
      },
      {
        status: "Resolved",
        timestamp: "2026-10-07T11:00:00.000Z",
        note: "Parks sanitation team cleared bins and installed extra 60-gallon container.",
        updatedBy: "Parks Maintenance"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "CF-2026-1013",
    title: "Minor paint graffiti on municipal utility box",
    description: "Spray paint tagging on the side of a telecom junction cabinet in a quiet lane. Does not interfere with equipment operation.",
    category: "other",
    location: "Sycamore Mews, Lane 3B",
    coordinates: { lat: 37.7630, lng: -122.4130 },
    reporterName: "Hannah Abbott",
    priorityScore: 26,
    priorityLabel: "Low",
    classificationReasons: [
      "Base score for other: 40 pts",
      "Mitigating context (minor/cosmetic or low-traffic area) [-14 pts]"
    ],
    status: "Submitted",
    createdAt: "2026-10-13T07:45:00.000Z",
    updatedAt: "2026-10-13T07:45:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-13T07:45:00.000Z",
        note: "Cosmetic report filed.",
        updatedBy: "Hannah Abbott (Citizen)"
      }
    ],
    imagePreview: null
  },
  {
    id: "CF-2026-1014",
    title: "Pothole cluster expanding after rain on bus route",
    description: "Cluster of 3 sharp-edged potholes forming in the right-hand bus lane. City buses are bouncing heavily and spraying muddy water toward waiting commuters at the bus stop.",
    category: "pothole",
    location: "Lexington Avenue & 19th St, Metro Bus Stop 44",
    coordinates: { lat: 37.7810, lng: -122.4240 },
    reporterName: "Tariq Mansoor",
    priorityScore: 72,
    priorityLabel: "High",
    classificationReasons: [
      "Base score for pothole: 52 pts",
      "High-speed traffic artery or collision-prone zone [+20 pts]"
    ],
    status: "Acknowledged",
    createdAt: "2026-10-12T15:40:00.000Z",
    updatedAt: "2026-10-13T09:00:00.000Z",
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-10-12T15:40:00.000Z",
        note: "Commuter flagged safety issue at high-frequency transit stop.",
        updatedBy: "Tariq Mansoor (Citizen)"
      },
      {
        status: "Acknowledged",
        timestamp: "2026-10-13T09:00:00.000Z",
        note: "Road maintenance cold-patch truck dispatched on morning route.",
        updatedBy: "Highway Division"
      }
    ],
    imagePreview: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
  }
];

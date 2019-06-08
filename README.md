# Mellidora app by Simon

Eucalyptus melliodora, commonly known as yellow box, is a medium-sized to occasionally tall eucalypt.

#TODO


Screen (Frontend work)
----------------------

Login screen
Password resets
Remember password

Register user (no need to build this as need to be setup in admin screen manually)

Screen to display gateway status
Screen to show active students

Search by Student Name
Search by Card number

Desktop View of Dashboard

Count Total Beacons
Count # Entered Each Day
Count # Exited
Count # No Show

Drillable list that works as a filter
 - Campus
 - Grade
 - Class
 - Student
 - Ping History


Backend
----------------------
Ping Recording
Ping History Recording
'Entered Campus' Algorithm
'Exited Campus' Algorithm
Migration to Firestore

Backend ETL
----------------------

Daily ETL (Extract Transform Load) from Powerschool into Beacon Allocation


Utilities
----------------------
Extraction to Spreadsheet
Extraction and Audit Log to S3
Beacon allocation spreadsheet backend ETL

Reports 
Number of students with iBeacons on campus each day
iBeacon signals not picked up by a BLE Gateway by 9:00 am daily
Absentees
Faulty iBeacons
Did not bring iBeacons
Battery monitoring

Health
 - Gateway health monitoring


Security
----------------------
User management screens 
Access levels (Just 1 level for now)





   expo install expo-blur expo-constants expo-file-system

   If "install" is not recognized as an expo command, update your expo-cli installation.

2. Change your imports so they use specific packages instead of the "expo" package:

 - import { BlurView } from 'expo' -> import { BlurView } from 'expo-blur'
 - import { Constants } from 'expo' -> import Constants from 'expo-constants'
 - import { FileSystem } from 'expo' -> import * as FileSystem from 'expo-file-system'


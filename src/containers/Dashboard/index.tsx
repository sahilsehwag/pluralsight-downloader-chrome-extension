import { useEffect } from 'react';
import L from 'react-on-lambda'

import { Button } from '~/components/ui/button';

import { Course } from '~/components/Course'
import { EmptyPage } from '~/components/EmtpyPage';

import { useStorage } from '~/hooks/useStorage';

import { MESSAGES } from '~/constants/actions';

import { sendAction } from '~/utils/chrome';
import { addCourseToQueue } from '~/modules/download';
import { startDownload } from '~/modules/queue';

const data = [
  { id: "1", name: "Unread" },
  { id: "2", name: "Threads" },
  {
    id: "3",
    name: "Chat Rooms",
    children: [
      { id: "c1", name: "General" },
      { id: "c2", name: "Random" },
      { id: "c3", name: "Open Source Projects" },
    ],
  },
  {
    id: "4",
    name: "Direct Messages",
    children: [
      {
        id: "d1",
        name: "Alice",
        children: [
          { id: "d1", name: "Alice2" },
          { id: "d2", name: "Bob2" },
          { id: "d3", name: "Charlie2" },
        ],
      },
      { id: "d2", name: "Bob" },
      { id: "d3", name: "Charlie" },
    ],
  },
];

const wrapper = L.div({
  className: 'h-full flex items-center justify-center gap-2',
})

const loadCourseBtn =
  Button({ onClick: sendAction(MESSAGES.PARSE_COURSE) })(
    'Load course',
  )

const downloadCourseBtn = course =>
  Button({ onClick: addCourseToQueue(course) })(
    'Download course',
  )

const downloadNextInQueueBtn = course =>
  Button({ onClick: startDownload() })(
    'Download next in queue',
  )

export const Dashboard = L(() => {
  const [course] = useStorage({ key: 'course' })

  return wrapper(
    !course ? loadCourseBtn : downloadCourseBtn(course),
    downloadNextInQueueBtn(course),
  )
})

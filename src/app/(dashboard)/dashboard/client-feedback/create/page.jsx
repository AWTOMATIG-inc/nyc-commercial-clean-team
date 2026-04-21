import Link from 'next/link'
import FeedbackForm from '../FeedbackForm'

export default function page() {
  return (
    <div>
        <div className="flex justify-between mt-8">
        <h1 className="text-2xl font-bold">Create new feedback</h1>
        <Link
          className="bg-slate text-white px-4 py-2 rounded-xl"
          href="/dashboard/client-feedback"
        >
          {" "}
          See Feedbacks
        </Link>
      </div>
        <FeedbackForm/>
    </div>
  )
}

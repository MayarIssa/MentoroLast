export type Message = {
  id: number;
  senderUserId: string;
  receiverUserId: string;
  message: string;
  sentAt: string;
  studentMentorId: number;
};

export type AssignedStudent = {
  id: number;
  name: string;
  // Add other fields as needed
};

export type Assigned = {
  endDate: string;
  id: number;
  image: string;
  name: string;
  planTitle: string;
  startDate: string;
};

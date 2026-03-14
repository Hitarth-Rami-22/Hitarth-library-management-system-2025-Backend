export interface Penalty {
  id: number;
  bookId: number;
  studentId: number;
  status?: number;    // 0=Pending, 1=Approved, 2=Rejected, 3=Returned, 4=ReturnRequested
  student?: {
    email: string;
  };
  book: {
    title: string;
    author: string;
  };
  approvedOn: string;
  returnedOn?: string;
  penaltyAmount: number;
}

type User = {
    id: number,
    role: string
}

declare namespace Express {
    export interface Request {
        user?: User
    }
}
// src/declarations.d.ts
declare module 'tailwind-paginate' {
    // Define the type of the Pagination component based on its actual usage
    interface PaginationProps {
      currentPage: number;
      totalItems: number;
      pageSize: number;
      onPageChange: (pageNumber: number) => void;
    }
  
    export const Pagination: React.FC<PaginationProps>;
  }
  
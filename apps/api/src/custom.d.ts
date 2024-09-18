type User = {
  id: number;
  role: string;
};

declare namespace Express {
  export interface Request {
    user?: User;
  }
}
// src/declarations.d.ts
declare module 'tailwind-paginate' {
  interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (pageNumber: number) => void;
  }

  export const Pagination: React.FC<PaginationProps>;
}

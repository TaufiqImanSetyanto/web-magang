export const getTheme = {
  Table: `
    --data-table-library_grid-template-columns:  20% 20% 10% 15% 15% 15% 40% 15% 40%;
    max-height: calc(100vh - 216px);
    @media (max-width: 768px) {
      --data-table-library_grid-template-columns: 30% 30% 30% 30% 30% 30% 50% 30% 50%;
    }
    @media (max-width: 480px) {
      --data-table-library_grid-template-columns: 40% 40% 40% 40% 40% 40% 60% 40% 60%
    }
    `,
  BaseCell: `
    padding: 6px 0;
  `,
  HeaderCell: `
    font-weight: bold;
    border-bottom: 1px solid #d1d5dc ;
    padding-bottom: 6px;
    `,
  Row: `
    &:not(:last-of-type) > .td {
      border-bottom: 1px solid #d1d5dc;
    }
      `,
};

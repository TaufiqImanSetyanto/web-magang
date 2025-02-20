export const getTheme = {
    Table: `
    --data-table-library_grid-template-columns:  20% 15% 30% 10% 10% 15%;
    max-height: calc(100vh - 216px);
    @media (max-width: 768px) {
      --data-table-library_grid-template-columns: 30% 25% 40% 20% 20% 30%;
    }
    @media (max-width: 480px) {
      --data-table-library_grid-template-columns: 40% 30% 50% 25% 25% 30%;
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
  }
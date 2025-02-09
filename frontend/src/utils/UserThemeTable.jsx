export const getTheme = {
    Table: `
    --data-table-library_grid-template-columns:  15% 15% 40% 15% 15% ;
    max-height: calc(100vh - 216px);
    @media (max-width: 768px) {
      --data-table-library_grid-template-columns: 25% 25% 40% 15% 15%;
    }
    @media (max-width: 480px) {
      --data-table-library_grid-template-columns: 25% 25% 50% 15% 25%;
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
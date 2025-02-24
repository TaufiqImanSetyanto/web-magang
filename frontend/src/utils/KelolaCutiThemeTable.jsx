export const getTheme = {
    Table: `
    --data-table-library_grid-template-columns:  18% 17% 10% 30% 8% 15% ;
    max-height: calc(100vh - 216px);
    @media (max-width: 768px) {
      --data-table-library_grid-template-columns: 25% 30% 20% 40% 15% 25%;
    }
    @media (max-width: 480px) {
      --data-table-library_grid-template-columns: 35% 40% 30% 60% 20% 30%;
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
export const createInvoice = async (invoiceData) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteInvoice = async (invoiceNumber) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/invoices/${invoiceNumber}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  }
};

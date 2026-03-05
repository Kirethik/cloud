"use client"
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../components/Providers';

// Mock the cart hook
jest.mock('../components/Providers', () => ({
    useCart: jest.fn(),
    __esModule: true,
}));

describe('ProductCard Component', () => {
    const mockProduct = {
        id: 'test-1',
        name: 'Azure Beanie',
        price: 15.00,
        imageUrl: '/test-img.jpg',
        category: 'Clothing'
    };

    test('renders product information correctly', () => {
        (useCart as jest.Mock).mockReturnValue({ addToCart: jest.fn() });

        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Azure Beanie')).toBeInTheDocument();
        expect(screen.getByText('$15.00')).toBeInTheDocument();
        expect(screen.getByText('Clothing')).toBeInTheDocument();
    });

    test('calls addToCart when button is clicked', () => {
        const mockAddToCart = jest.fn();
        (useCart as jest.Mock).mockReturnValue({ addToCart: mockAddToCart });

        render(<ProductCard product={mockProduct} />);

        const button = screen.getByText('Add to Cart');
        fireEvent.click(button);

        expect(mockAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'test-1', quantity: 1 }));
    });
});

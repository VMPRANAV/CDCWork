import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { 
    key: 'fullName', 
    label: 'Name',
    defaultOrder: 'asc'
  },
  { 
    key: 'collegeEmail', 
    label: 'Email',
    defaultOrder: 'asc'
  },
  { 
    key: 'dept', 
    label: 'Department',
    defaultOrder: 'asc'
  },
  { 
    key: 'ugCgpa', 
    label: 'CGPA',
    defaultOrder: 'desc'
  },
  { 
    key: 'isPlaced', 
    label: 'Placement Status',
    defaultOrder: 'desc'
  },
  { 
    key: 'currentArrears', 
    label: 'Current Arrears',
    defaultOrder: 'asc'
  },
  { 
    key: 'createdAt', 
    label: 'Registration Date',
    defaultOrder: 'desc'
  },
];

export function Sort({ sort, setSort }) {
  const currentSort = SORT_OPTIONS.find(option => option.key === sort.key) || SORT_OPTIONS[0];
  const isAscending = sort.order === 'asc';
  
  const handleSortChange = (key) => {
    // If clicking the same field, toggle the order
    if (key === sort.key) {
      setSort({
        key,
        order: sort.order === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // If selecting a new field, use its default order
      const newSortOption = SORT_OPTIONS.find(option => option.key === key);
      setSort({
        key,
        order: newSortOption?.defaultOrder || 'asc'
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sort by {currentSort.label}</span>
          <span className="ml-1 text-muted-foreground">
            {isAscending ? 'A→Z' : 'Z→A'}
          </span>
          <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {SORT_OPTIONS.map((option) => {
          const isActive = sort.key === option.key;
          const isAsc = isActive ? sort.order === 'asc' : option.defaultOrder === 'asc';
          
          return (
            <DropdownMenuItem 
              key={option.key} 
              className="flex justify-between items-center"
              onClick={() => handleSortChange(option.key)}
            >
              <div className="flex items-center">
                <span>{option.label}</span>
              </div>
              <div className="flex items-center">
                {isActive && (
                  <span className="text-muted-foreground text-xs mr-2">
                    {isAsc ? 'A→Z' : 'Z→A'}
                  </span>
                )}
                <Check 
                  className={cn(
                    "h-4 w-4",
                    isActive ? "opacity-100" : "opacity-0"
                  )} 
                />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

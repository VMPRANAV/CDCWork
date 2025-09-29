import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter as FilterIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const departments = [
  'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS', 'AIML', 'CSBS', 'CSD'
];

export function Filter({ filters, setFilters, onClear }) {
  const activeFilterCount = [
    filters.department,
    filters.placementStatus,
    filters.minCGPA,
    filters.maxCGPA,
    filters.hasArrears !== null
  ].filter(Boolean).length;

  const handleDepartmentChange = (dept) => {
    setFilters(prev => ({
      ...prev,
      department: prev.department === dept ? '' : dept
    }));
  };

  const handlePlacementChange = (status) => {
    setFilters(prev => ({
      ...prev,
      placementStatus: prev.placementStatus === status ? '' : status
    }));
  };

  const handleArrearsChange = (value) => {
    setFilters(prev => ({
      ...prev,
      hasArrears: prev.hasArrears === value ? null : value
    }));
  };

  const handleCGPAChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value ? parseFloat(value) : ''
    }));
  };

  const clearAll = () => {
    setFilters({
      department: '',
      placementStatus: '',
      minCGPA: '',
      maxCGPA: '',
      hasArrears: null,
    });
    onClear?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilterIcon className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="px-1.5 py-0.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs text-muted-foreground"
                onClick={clearAll}
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Department</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={filters.department === dept ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => handleDepartmentChange(dept)}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">Placement Status</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={filters.placementStatus === 'placed' ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2 text-xs flex-1"
                  onClick={() => handlePlacementChange('placed')}
                >
                  Placed
                </Button>
                <Button
                  variant={filters.placementStatus === 'notPlaced' ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2 text-xs flex-1"
                  onClick={() => handlePlacementChange('notPlaced')}
                >
                  Not Placed
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">CGPA Range</Label>
              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.minCGPA}
                    onChange={(e) => handleCGPAChange('minCGPA', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  to
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.maxCGPA}
                    onChange={(e) => handleCGPAChange('maxCGPA', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">Arrears</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={filters.hasArrears === true ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2 text-xs flex-1"
                  onClick={() => handleArrearsChange(true)}
                >
                  With Arrears
                </Button>
                <Button
                  variant={filters.hasArrears === false ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2 text-xs flex-1"
                  onClick={() => handleArrearsChange(false)}
                >
                  No Arrears
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

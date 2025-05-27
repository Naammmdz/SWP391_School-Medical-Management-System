export const mockUsers = [
  {
    id: 1,
    phone: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    permissions: {
      dashboard: ['create', 'read', 'update', 'delete'],
      users: ['create', 'read', 'update', 'delete'],
      health_record: ['read'],
      medicine_declarations: ['read'],
      medical_events: ['read'],
      medical_supplies: ['read'],
      pharmaceutical: ['read'],
      vaccination_management: ['read']
    }
  },
  {
    id: 2,
    phone: 'parent',
    password: 'parent123',
    name: 'Parent User',
    role: 'parent',
    permissions: {
      health_record: ['create', 'read', 'update', 'delete'],
      medicine_declarations: ['create', 'read', 'update', 'delete'],
      medical_events: ['read', 'confirm'],
      medical_supplies: ['read', 'confirm'],
      pharmaceutical: ['read', 'confirm'],
      vaccination_management: ['read', 'confirm', 'reject', 'notify']
    }
  },
  {
    id: 3,
    phone: 'nurse',
    password: 'nurse123',
    name: 'Nurse User',
    role: 'nurse',
    permissions: {
      medical_events: ['create', 'read', 'update', 'delete'],
      medical_supplies: ['create', 'read', 'update', 'delete'],
      pharmaceutical: ['create', 'read', 'update', 'delete'],
      vaccination_management: ['create', 'read', 'update', 'delete'],
      health_record: ['read', 'confirm'],
      medicine_declarations: ['read', 'confirm']
    }
  }
]; 
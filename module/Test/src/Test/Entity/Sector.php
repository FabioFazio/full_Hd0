<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 */
class Sector {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255) */
	protected $name;
	
	/** @ORM\ManyToOne(targetEntity="User") */
	protected $manager;
	
	/** @ORM\ManyToOne(targetEntity="Department") */
	protected $department;
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
 
    public function getDepartment(){
    	return $this->department;
    }
    
    public function setDepartment($department){
    	$this->department = $department;
    }
    
    public function getManager(){
    	return $this->manager;
    }
    
    public function setManager($manager){
    	$this->grants = $manager;
    }
    
    public function getFullname(){
       $dep        = $this->getDepartment()?$this->getDepartment()->getName():'';
	   $stoDep   = $dep?$this->getDepartment()->getStore()->getName().' - '.$dep:'';
	   $fullname = $stoDep?$stoDep.' - '.$this->getName():$this->getName();
	   return $fullname;
    }
    
    public function toArray(){
        $array = get_object_vars($this);
        $array['department_id'] = $this->getDepartment()?$this->getDepartment()->getId():null;
        unset($array['department']);
        
    	$array['manager_id'] = $this->getManager()?$this->getManager()->getId():null;
        unset($array['manager']);
        
        $array['fullname'] = $this->getFullname();

        return $array;
    }
}